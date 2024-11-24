import fs from "fs";
import path from "path";
export async function saveBlobToFile(blob : Blob, filePath: string) {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const concatenatedPath = path.join(__dirname, filePath);
  const directory = path.dirname(concatenatedPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.writeFileSync(filePath, buffer);
  console.log(`Archivo guardado en ${filePath}`);
}


