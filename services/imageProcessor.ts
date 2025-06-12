
import { OriginalImageType } from '../types';

export const convertToPng = async (file: File): Promise<Blob> => {
  if (!window.heic2any) {
    throw new Error('HEIC conversion library (heic2any) is not loaded.');
  }
  try {
    const conversionResult = await window.heic2any({
      blob: file,
      toType: "image/png",
      quality: 0.8, // Adjust quality as needed
    });
    // heic2any can return an array of blobs or a single blob
    const resultBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    if (!(resultBlob instanceof Blob)) {
        throw new Error('HEIC conversion did not return a Blob.');
    }
    return resultBlob;
  } catch (error) {
    console.error("HEIC to PNG conversion failed:", error);
    throw new Error(`HEICファイルの変換に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const processFileForImage = async (inputFile: File): Promise<OriginalImageType> => {
  let fileToProcess = inputFile;

  const fileName = inputFile.name.toLowerCase();
  const isHeic = inputFile.type === 'image/heic' || inputFile.type === 'image/heif' || fileName.endsWith('.heic') || fileName.endsWith('.heif');

  if (isHeic) {
    try {
      const pngBlob = await convertToPng(inputFile);
      // Create a new File object to keep a consistent type, though a Blob would also work for FileReader
      fileToProcess = new File([pngBlob], inputFile.name.replace(/\.(heic|heif)$/i, '.png'), { type: 'image/png' });
    } catch (e) {
      throw e; // Re-throw conversion error
    }
  }

  // Check if file type is an image after potential conversion
  if (!fileToProcess.type.startsWith('image/')) {
    throw new Error('サポートされていないファイル形式です。画像ファイルを選択してください。');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('ファイルの読み込みに失敗しました。'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => {
        reject(new Error('画像データの読み込みまたは解析に失敗しました。ファイルが破損している可能性があります。'));
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      reject(new Error('ファイルリーダーでエラーが発生しました。'));
    };
    reader.readAsDataURL(fileToProcess);
  });
};
