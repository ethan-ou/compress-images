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
  progressive?: boolean;
  useMozJpeg?: boolean;
  rotate?: number;
  stripMetadata?: boolean;
  toFormat?: ForcedFormats;
}

type Formats = 'jpeg' | 'png' | 'webp' | 'tiff' | 'gif' | 'svg';
type ForcedFormats = 'jpeg' | 'png' | 'webp' | 'tiff';

function resolveFileExtension(outputPath: string, extension: Formats) {
  return path.format({
    dir: path.dirname(outputPath),
    base: path.basename(outputPath, path.extname(outputPath)),
    ext: extension,
  });
}

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
    quality: [options.quality, Math.min(options.quality + 25, 100)], // e.g. 40-65
    strip: !!options.stripMetadata, // Must be a bool
  });

  return compressImageType(pipeline, settings, resolveFileExtension(outputPath, 'png'));
}

async function compressJpeg(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminMozjpeg({
    quality: options.quality,
    progressive: options.progressive,
  });

  return compressImageType(pipeline, settings, resolveFileExtension(outputPath, 'jpeg'));
}

async function compressWebP(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminWebp({
    quality: options.quality,
    metadata: options.stripMetadata ? `none` : `all`,
  });

  return compressImageType(pipeline, settings, resolveFileExtension(outputPath, 'webp'));
}

async function compressSvg(pipeline: Sharp, outputPath: string, options: Options) {
  const settings = imageminSvgo();
  return compressImageType(pipeline, settings, resolveFileExtension(outputPath, 'svg'));
}

async function compressGif(pipeline: Sharp, outputPath: string, options: Options) {
  // Colors start reducing at 75% quality.
  const settings = imageminGifsicle({
    colors: Math.min(Math.round(options.quality * 3.4), 255),
    optimizationLevel: 3,
  });
  return compressImageType(pipeline, settings, resolveFileExtension(outputPath, 'gif'));
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
        fit: 'inside',
        background: { r: 0, b: 0, g: 0, alpha: 0 },
      })
      .png({
        progressive: options.progressive,
        force: options.toFormat === `png`,
      })
      .webp({
        quality: 100,
        lossless: true,
        force: options.toFormat === `webp`,
      })
      .tiff({
        quality: options.quality,
        force: options.toFormat === `tiff`,
      });

    // jpeg
    if (!options.useMozJpeg) {
      clonedPipeline = clonedPipeline.jpeg({
        quality: options.quality,
        progressive: options.progressive,
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
      await clonedPipeline.toFile(resolveFileExtension(outputPath, options.toFormat || 'jpeg'));
    } catch (err) {
      throw new Error(`Failed to write ${file} into ${outputPath}. (${err.message})`);
    }
  } catch (err) {
    throw new Error(`Processing ${file} failed. ${err}`);
  }

  return file;
}
