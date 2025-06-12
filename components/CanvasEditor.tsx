
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { OriginalImageType, CanvasEditorHandles } from '../types';

interface CanvasEditorProps {
  baseImage: OriginalImageType | null;
  brushColor: string;
  brushSize: number;
}

export const CanvasEditor = forwardRef<CanvasEditorHandles, CanvasEditorProps>(({ baseImage, brushColor, brushSize }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const getCanvasContext = useCallback(() => {
    return canvasRef.current?.getContext('2d') || null;
  }, []);
  
  const drawBaseImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (canvas && ctx && baseImage) {
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before drawing new base image
        ctx.drawImage(img, 0, 0, baseImage.width, baseImage.height);
      };
      img.onerror = () => {
        console.error("Failed to load image onto canvas.");
        // Optionally display an error on the canvas itself
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "gray";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Error loading image", canvas.width / 2, canvas.height / 2);

      }
      img.src = baseImage.dataUrl;
    } else if (canvas && ctx && !baseImage) {
      // Clear canvas if no image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Optionally set a default size or keep it responsive
      // canvas.width = canvas.parentElement?.clientWidth || 500;
      // canvas.height = canvas.parentElement?.clientHeight || 375;
    }
  }, [baseImage, getCanvasContext]);

  useEffect(() => {
    drawBaseImage();
  }, [baseImage, drawBaseImage]);

  useImperativeHandle(ref, () => ({
    exportAsDataURL: () => {
      return canvasRef.current?.toDataURL('image/png') || '';
    },
    clearDrawing: () => {
      drawBaseImage(); // Redraws the base image, effectively clearing user drawings
    }
  }));

  const getMousePosition = (event: React.MouseEvent | React.TouchEvent): { x: number, y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event.nativeEvent instanceof MouseEvent) {
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if (event.nativeEvent instanceof TouchEvent && event.nativeEvent.touches[0]) {
      clientX = event.nativeEvent.touches[0].clientX;
      clientY = event.nativeEvent.touches[0].clientY;
    } else {
      return null;
    }
    
    // Calculate scale factors if canvas is scaled by CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const pos = getMousePosition(event);
    if (!pos) return;
    setIsDrawing(true);
    setLastPosition(pos);
     // Prevent page scrolling on touch devices
    if (event.nativeEvent instanceof TouchEvent) {
      event.preventDefault();
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const currentPosition = getMousePosition(event);
    if (!currentPosition || !lastPosition) return;

    const ctx = getCanvasContext();
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();
    }
    setLastPosition(currentPosition);
     // Prevent page scrolling on touch devices
    if (event.nativeEvent instanceof TouchEvent) {
      event.preventDefault();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null);
  };

  if (!baseImage) {
    return null; // Don't render canvas if there's no image (placeholder handled by App.tsx)
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={endDrawing}
      onTouchCancel={endDrawing}
      className="max-w-full max-h-full object-contain cursor-crosshair rounded-md shadow-lg"
      style={{ touchAction: 'none' }} // Prevents browser default touch actions like scrolling
    />
  );
});

CanvasEditor.displayName = 'CanvasEditor';
