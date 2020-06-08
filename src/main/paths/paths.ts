import path from 'path';

interface PathOptions {
  prefix: string;
  suffix: string;
  directory: string;
  folder: string;
}

// async function checkPath(filePath) {
//     try {

//     }
// }

export function newFile(filePath: string, options: PathOptions): string {
  const fileNameNoExt = path.basename(filePath, path.extname(filePath));
  const fileExt = path.extname(filePath);

  return path.format({
    dir: path.dirname(filePath),
    base: `${options.prefix}${fileNameNoExt}${options.suffix}${fileExt}`,
  });
}

export function overwriteFile(filePath: string, options: PathOptions): string {
  return filePath;
}

export function newFolder(filePath: string, options: PathOptions): string {
  const fileName = path.basename(filePath);
  const newFolderPath = path.join(path.dirname(filePath), options.folder);

  return path.format({
    dir: newFolderPath,
    base: fileName,
  });
}

export function selectFolder(filePath: string, options: PathOptions): string {
  const fileName = path.basename(filePath);

  return path.format({
    dir: options.directory,
    base: fileName,
  });
}
