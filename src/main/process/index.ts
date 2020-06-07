import fs from 'fs-extra';
import path from 'path';
import sharp, { Sharp } from 'sharp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

interface Transform {
  height: number;
  width: number;
  cropFocus: number;
  pngCompressionLevel: number;
  pngCompressionSpeed: number;
  quality: number;
  jpegQuality: number;
  pngQuality: number;
  webpQuality: number;
  jpegProgressive: boolean;
  rotate: number;
  trim: number;
  background: string;
  fit: sharp.FitEnum;
  outputPath: string;
  stripMetadata: boolean;
  args: any;
}

interface Options {
  stripMetadata?: boolean;
  defaultQuality?: number;
  useMozJpeg?: boolean;
}

const pluginDefaults = {
  forceBase64Format: false,
  useMozJpeg: process.env.GATSBY_JPEG_ENCODER === `MOZJPEG`,
  stripMetadata: true,
  lazyImageGeneration: true,
  defaultQuality: 50,
};

const generalArgs = {
  quality: 50,
  jpegQuality: null,
  pngQuality: null,
  webpQuality: null,
  jpegProgressive: true,
  pngCompressionLevel: 9,
  // default is 4 (https://github.com/kornelski/pngquant/blob/4219956d5e080be7905b5581314d913d20896934/rust/bin.rs#L61)
  pngCompressionSpeed: 4,
  base64: true,
  grayscale: false,
  duotone: false,
  pathPrefix: ``,
  toFormat: ``,
  toFormatBase64: ``,
  sizeByPixelDensity: false,
  rotate: 0,
};

async function compressPng(pipeline: Sharp, outputPath: string, options: Transform) {
  return pipeline.toBuffer().then((sharpBuffer) =>
    imagemin
      .buffer(sharpBuffer, {
        plugins: [
          imageminPngquant({
            quality: [
              options.pngQuality || options.quality,
              Math.min((options.pngQuality || options.quality) + 25, 100),
            ], // e.g. 40-65
            speed: options.pngCompressionSpeed ? options.pngCompressionSpeed : undefined,
            strip: !!options.stripMetadata, // Must be a bool
          }),
        ],
      })
      .then((imageminBuffer) => fs.writeFile(outputPath, imageminBuffer))
  );
}

async function compressJpg(pipeline: Sharp, outputPath: string, options: Transform) {
  return pipeline.toBuffer().then((sharpBuffer) =>
    imagemin
      .buffer(sharpBuffer, {
        plugins: [
          imageminMozjpeg({
            quality: options.jpegQuality || options.quality,
            progressive: options.jpegProgressive,
          }),
        ],
      })
      .then((imageminBuffer) => fs.writeFile(outputPath, imageminBuffer))
  );
}

async function compressWebP(pipeline: Sharp, outputPath: string, options: Transform) {
  return pipeline.toBuffer().then((sharpBuffer) =>
    imagemin
      .buffer(sharpBuffer, {
        plugins: [
          imageminWebp({
            quality: options.webpQuality || options.quality,
            metadata: options.stripMetadata ? `none` : `all`,
          }),
        ],
      })
      .then((imageminBuffer) => fs.writeFile(outputPath, imageminBuffer))
  );
}

function healOptions({ defaultQuality: quality }, args, fileExtension = ``, defaultArgs = {}) {
  let options = _.defaults({}, args, { quality }, defaultArgs, generalArgs);
  options.quality = parseInt(options.quality, 10);
  options.pngCompressionLevel = parseInt(options.pngCompressionLevel, 10);
  options.pngCompressionSpeed = parseInt(options.pngCompressionSpeed, 10);
  options.toFormat = options.toFormat.toLowerCase();
  options.toFormatBase64 = options.toFormatBase64.toLowerCase();

  // when toFormat is not set we set it based on fileExtension
  if (options.toFormat === ``) {
    if (!fileExtension) {
      throw new Error(`toFormat seems to be empty, we need a fileExtension to set it.`);
    }
    options.toFormat = fileExtension.toLowerCase();

    if (fileExtension === `jpeg`) {
      options.toFormat = `jpg`;
    }
  }

  // only set width to 400 if neither width nor height is passed
  if (options.width === undefined && options.height === undefined) {
    options.width = 400;
  } else if (options.width !== undefined) {
    options.width = parseInt(options.width, 10);
  } else if (options.height !== undefined) {
    options.height = parseInt(options.height, 10);
  }

  // only set maxWidth to 800 if neither maxWidth nor maxHeight is passed
  if (options.maxWidth === undefined && options.maxHeight === undefined) {
    options.maxWidth = 800;
  } else if (options.maxWidth !== undefined) {
    options.maxWidth = parseInt(options.maxWidth, 10);
  } else if (options.maxHeight !== undefined) {
    options.maxHeight = parseInt(options.maxHeight, 10);
  }

  [`width`, `height`, `maxWidth`, `maxHeight`].forEach((prop) => {
    if (typeof options[prop] !== `undefined` && options[prop] < 1) {
      throw new Error(
        `${prop} has to be a positive int larger than zero (> 0), now it's ${options[prop]}`
      );
    }
  });

  return options;
}

export default function processFile(
  file: string,
  transforms: Transform[],
  options: Options = {}
): Promise<Transform>[] {
  let pipeline: Sharp;
  try {
    pipeline = sharp(file);

    // Keep Metadata
    if (!options.stripMetadata) {
      pipeline = pipeline.withMetadata();
    }
  } catch (err) {
    throw new Error(`Failed to load image ${file} into sharp. ${err}`);
  }

  return transforms.map(async (transform) => {
    try {
      const { outputPath, args } = transform;
      await fs.ensureDir(path.dirname(outputPath));

      const transformArgs = healOptions({ defaultQuality: options.defaultQuality }, args);

      let clonedPipeline = transforms.length > 1 ? pipeline.clone() : pipeline;

      if (transformArgs.trim) {
        clonedPipeline = clonedPipeline.trim(transformArgs.trim);
      }

      if (!transformArgs.rotate) {
        clonedPipeline = clonedPipeline.rotate();
      }

      // Sharp only allows ints as height/width. Since both aren't always
      // set, check first before trying to round them.
      let roundedHeight = transformArgs.height;
      if (roundedHeight) {
        roundedHeight = Math.round(roundedHeight);
      }

      let roundedWidth = transformArgs.width;
      if (roundedWidth) {
        roundedWidth = Math.round(roundedWidth);
      }

      clonedPipeline
        .resize(roundedWidth, roundedHeight, {
          position: transformArgs.cropFocus,
          fit: transformArgs.fit,
          background: transformArgs.background,
        })
        .png({
          compressionLevel: transformArgs.pngCompressionLevel,
          adaptiveFiltering: false,
          force: transformArgs.toFormat === `png`,
        })
        .webp({
          quality: transformArgs.webpQuality || transformArgs.quality,
          force: transformArgs.toFormat === `webp`,
        })
        .tiff({
          quality: transformArgs.quality,
          force: transformArgs.toFormat === `tiff`,
        });

      // jpeg
      if (!options.useMozJpeg) {
        clonedPipeline = clonedPipeline.jpeg({
          quality: transformArgs.jpegQuality || transformArgs.quality,
          progressive: transformArgs.jpegProgressive,
          force: transformArgs.toFormat === `jpg`,
        });
      }

      // grayscale
      if (transformArgs.grayscale) {
        clonedPipeline = clonedPipeline.grayscale();
      }

      // rotate
      if (transformArgs.rotate && transformArgs.rotate !== 0) {
        clonedPipeline = clonedPipeline.rotate(transformArgs.rotate);
      }

      // lets decide how we want to save this transform
      if (transformArgs.toFormat === `png`) {
        await compressPng(clonedPipeline, outputPath, {
          pngQuality: transformArgs.pngQuality,
          quality: transformArgs.quality,
          pngCompressionSpeed: transformArgs.compressionSpeed,
          stripMetadata: options.stripMetadata,
        });
        return transform;
      }

      if (options.useMozJpeg && transformArgs.toFormat === `jpg`) {
        await compressJpg(clonedPipeline, outputPath, transformArgs);
        return transform;
      }

      if (transformArgs.toFormat === `webp`) {
        await compressWebP(clonedPipeline, outputPath, transformArgs);
        return transform;
      }

      try {
        await clonedPipeline.toFile(outputPath);
      } catch (err) {
        throw new Error(`Failed to write ${file} into ${outputPath}. (${err.message})`);
      }
    } catch (err) {
      if (err) {
        // rethrow
        throw err;
      }

      throw new Error(`Processing ${file} failed ${err}`);
    }

    return transform;
  });
}
