import fs from 'fs-extra';
import path from 'path';
import sharp, { Sharp, FitEnum } from 'sharp';
import imagemin, { Plugin } from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import imageminSvgo from 'imagemin-svgo';
import imageminGifsicle from 'imagemin-gifsicle';
import { AppFile } from '../../types';

interface Options {
  quality: number;
  height?: number;
  width?: number;
  cropFocus?: number;
  pngCompressionLevel?: number;
  pngCompressionSpeed?: number;
  jpegQuality?: number;
  pngQuality?: number;
  webpQuality?: number;
  jpegProgressive?: boolean;
  useMozJpeg?: boolean;
  gifColors?: number;
  gifOptimisationLevel?: number;
  rotate?: number;
  trim?: number;
  background?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside' | undefined;
  stripMetadata?: boolean;
  toFormat?: Formats;
}

type Formats = 'jpeg' | 'png' | 'webp' | 'tiff';

const defaults = {
  quality: 80,
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

async function compressImageType(
  pipeline: Sharp,
  plugin: Plugin,
  outputPath: string
): Promise<any> {
  return pipeline.toBuffer().then((sharpBuffer: Buffer) =>
    imagemin
      .buffer(sharpBuffer, {
        plugins: [plugin],
      })
      .then((imageminBuffer: Buffer) => fs.writeFile(outputPath, imageminBuffer))
  );
}

async function compressPng(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminPngquant({
    quality: [
      options.pngQuality || options.quality,
      Math.min((options.pngQuality || options.quality) + 25, 100),
    ], // e.g. 40-65
    speed: options.pngCompressionSpeed ? options.pngCompressionSpeed : undefined,
    strip: !!options.stripMetadata, // Must be a bool
  });

  return compressImageType(pipeline, settings, outputPath);
}

async function compressJpeg(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminMozjpeg({
    quality: options.jpegQuality || options.quality,
    progressive: options.jpegProgressive,
  });

  return compressImageType(pipeline, settings, outputPath);
}

async function compressWebP(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminWebp({
    quality: options.webpQuality || options.quality,
    metadata: options.stripMetadata ? `none` : `all`,
  });

  return compressImageType(pipeline, settings, outputPath);
}

async function compressSvg(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminSvgo();
  return compressImageType(pipeline, settings, outputPath);
}

async function compressGif(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminGifsicle({
    colors: options.gifColors,
    optimizationLevel: options.gifOptimisationLevel,
  });
  return compressImageType(pipeline, settings, outputPath);
}

// Check file path input
export default async function processFile(
  filePath: string,
  outputPath: string,
  file: AppFile,
  options: Options
): Promise<AppFile> {
  let pipeline: Sharp;
  try {
    pipeline = sharp(filePath);

    // Keep Metadata
    if (!options.stripMetadata) {
      pipeline = pipeline.withMetadata();
    }
  } catch (err) {
    throw new Error(`Failed to load image ${file} into sharp. ${err}`);
  }

  try {
    await fs.ensureDir(path.dirname(outputPath));
    let clonedPipeline: Sharp = pipeline.clone();

    if (options.trim) {
      clonedPipeline = clonedPipeline.trim(options.trim);
    }

    // Sharp will auto-rotate images with EXIF data
    if (!options.rotate) {
      clonedPipeline = clonedPipeline.rotate();
    }

    // Sharp only allows ints as height/width. Since both aren't always
    // set, check first before trying to round them.
    let roundedHeight = options.height;
    if (roundedHeight) {
      roundedHeight = Math.round(roundedHeight);
    }

    let roundedWidth = options.width;
    if (roundedWidth) {
      roundedWidth = Math.round(roundedWidth);
    }

    clonedPipeline
      .resize(roundedWidth, roundedHeight, {
        position: options.cropFocus,
        fit: options.fit,
        background: options.background,
      })
      .png({
        compressionLevel: options.pngCompressionLevel,
        adaptiveFiltering: false,
        force: options.toFormat === `png`,
      })
      .webp({
        quality: options.webpQuality || options.quality,
        force: options.toFormat === `webp`,
      })
      .tiff({
        quality: options.quality,
        force: options.toFormat === `tiff`,
      });

    // jpeg
    if (!options.useMozJpeg) {
      clonedPipeline = clonedPipeline.jpeg({
        quality: options.jpegQuality || options.quality,
        progressive: options.jpegProgressive,
        force: options.toFormat === `jpeg`,
      });
    }

    // rotate
    if (options.rotate && options.rotate !== 0) {
      clonedPipeline = clonedPipeline.rotate(options.rotate);
    }

    if (options.toFormat === `png` || (!options.toFormat && file.type === 'image/png')) {
      await compressPng(clonedPipeline, outputPath, options);
      return file;
    }

    if (
      (options.useMozJpeg && options.toFormat === `jpeg`) ||
      (!options.toFormat && file.type === 'image/jpeg')
    ) {
      await compressJpeg(clonedPipeline, outputPath, options);
      return file;
    }

    if (options.toFormat === `webp` || (!options.toFormat && file.type === 'image/webp')) {
      await compressWebP(clonedPipeline, outputPath, options);
      return file;
    }

    if (!options.toFormat && file.type === 'image/svg+xml') {
      await compressSvg(clonedPipeline, outputPath, options);
      return file;
    }

    if (!options.toFormat && file.type === 'image/gif') {
      await compressGif(clonedPipeline, outputPath, options);
      return file;
    }

    try {
      await clonedPipeline.toFile(outputPath);
    } catch (err) {
      throw new Error(`Failed to write ${file} into ${outputPath}. (${err.message})`);
    }
  } catch (err) {
    throw new Error(`Processing ${file} failed. ${err}`);
  }

  return file;
}
