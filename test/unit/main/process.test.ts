import fs from 'fs-extra';
import path from 'path';
import process from '../../../src/main/process';

describe('Image Process', () => {
  it('Processes JPEG Images', async () => {
    const inputPath = path.join(__dirname, 'mock', 'image.jpg');
    const outputPath = path.join(__dirname, 'mock', '__output__', 'image.jpg');
    const appFile = [
      {
        lastModified: Date.now(),
        name: path.basename(inputPath),
        path: inputPath,
        size: fs.statSync(inputPath).size,
        type: 'image/jpeg',
      },
    ];

    const options = {
      quality: 80,
      height: 250,
    };

    await expect(
      process.create(
        appFile,
        { outputPath, settings: options },
        (message) => message,
        (error) => error
      )
    ).resolves.toEqual([{ status: 'fulfilled', value: appFile[0] }]);

    fs.removeSync(path.dirname(outputPath));
  });
});
