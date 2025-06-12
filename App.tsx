
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasEditor } from './components/CanvasEditor';
import { FileInputButton } from './components/FileInputButton';
import { Toolbar } from './components/Toolbar';
import { PenControls } from './components/PenControls'; // New import
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { PlaceholderInstructions } from './components/PlaceholderInstructions';
import type { OriginalImageType, CanvasEditorHandles } from './types';
import { processFileForImage } from './services/imageProcessor';

// Make heic2any available globally for TypeScript
declare global {
  interface Window {
    heic2any: ({ blob, toType, quality }: { blob: Blob, toType?: string, quality?: number }) => Promise<Blob>;
  }
}

export const BRUSH_COLORS = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#007BFF' },
  { name: 'Green', value: '#28A745' },
  { name: 'Yellow', value: '#FFC107' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
];

export const BRUSH_SIZES = [
  { name: 'S', value: 3, label: 'Small (3px)' },
  { name: 'M', value: 5, label: 'Medium (5px)' },
  { name: 'L', value: 10, label: 'Large (10px)' },
];

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<OriginalImageType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasEditorRef = useRef<CanvasEditorHandles>(null);

  const [brushColor, setBrushColor] = useState<string>(BRUSH_COLORS[0].value);
  const [brushSize, setBrushSize] = useState<number>(BRUSH_SIZES[1].value);

  const handleImageProcessed = useCallback((image: OriginalImageType) => {
    setOriginalImage(image);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((message: string) => {
    setError(message);
    setOriginalImage(null);
    setIsLoading(false);
  }, []);

  const loadImageFromFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const processedImg = await processFileForImage(file);
      handleImageProcessed(processedImg);
    } catch (err) {
      console.error("Error processing file:", err);
      handleError(err instanceof Error ? err.message : 'ファイルの処理中にエラーが発生しました。');
    }
  }, [handleImageProcessed, handleError]);

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (isLoading) return;
      const items = event.clipboardData?.items;
      if (!items) return;

      let imageFile: File | null = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          imageFile = items[i].getAsFile();
          break;
        }
      }

      if (imageFile) {
        event.preventDefault();
        await loadImageFromFile(imageFile);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [isLoading, loadImageFromFile]);

  const handleDownload = () => {
    if (canvasEditorRef.current && originalImage) {
      const dataUrl = canvasEditorRef.current.exportAsDataURL();
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'edited-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("ダウンロードする画像がありません。");
    }
  };

  const handleClear = () => {
    if (canvasEditorRef.current) {
      canvasEditorRef.current.clearDrawing();
      setError(null);
    }
  };
  
  const handleFileSelected = (file: File) => {
    loadImageFromFile(file);
  };

  const handleBrushColorChange = (color: string) => {
    setBrushColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };
  
  const isControlsDisabled = !originalImage || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-6xl mb-6 md:mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 py-2">
          オンライン画像エディター
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          画像をアップロードまたはペーストして、ペンツールで自由に書き込もう！ (WebP/HEIC対応)
        </p>
      </header>

      <main className="w-full max-w-6xl bg-slate-800 shadow-2xl shadow-slate-900/50 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-4 space-y-6">
            <FileInputButton onFileSelected={handleFileSelected} disabled={isLoading} />
            <p className="text-sm text-center text-slate-400">または、画像を直接ページにペーストしてください。</p>
            <Toolbar
              onDownload={handleDownload}
              onClear={handleClear}
              isControlsDisabled={isControlsDisabled}
            />
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
          </div>

          <div className="md:col-span-8 flex flex-col">
            <PenControls
              brushColors={BRUSH_COLORS}
              currentBrushColor={brushColor}
              onBrushColorChange={handleBrushColorChange}
              brushSizes={BRUSH_SIZES}
              currentBrushSize={brushSize}
              onBrushSizeChange={handleBrushSizeChange}
              isDisabled={isControlsDisabled}
            />
            <div className={`flex-grow bg-slate-700 rounded-lg p-1 aspect-[4/3] flex items-center justify-center relative overflow-hidden mt-3 ${isControlsDisabled && !originalImage ? 'border-2 border-dashed border-slate-600' : ''}`}>
               {originalImage ? (
                  <CanvasEditor 
                    ref={canvasEditorRef} 
                    baseImage={originalImage} 
                    brushColor={brushColor} 
                    brushSize={brushSize} 
                  />
               ) : (
                  !isLoading && <PlaceholderInstructions />
               )}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 md:mt-12 text-center text-slate-500 text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} Online Image Editor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
