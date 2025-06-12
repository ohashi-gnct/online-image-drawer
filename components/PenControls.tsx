
import React from 'react';

interface BrushColor {
  name: string;
  value: string;
}

interface BrushSize {
  name: string; // S, M, L - not directly used for display but good for identification
  value: number; // 3, 5, 10 (actual brush size)
  label: string; // 'Small (3px)', 'Medium (5px)', 'Large (10px)' - for title/aria-label
}

interface PenControlsProps {
  brushColors: BrushColor[];
  currentBrushColor: string;
  onBrushColorChange: (color: string) => void;
  brushSizes: BrushSize[];
  currentBrushSize: number;
  onBrushSizeChange: (size: number) => void;
  isDisabled: boolean;
}

export const PenControls: React.FC<PenControlsProps> = ({
  brushColors,
  currentBrushColor,
  onBrushColorChange,
  brushSizes,
  currentBrushSize,
  onBrushSizeChange,
  isDisabled,
}) => {
  // Determine diameter for size preview circles
  const getPreviewSize = (brushValue: number): number => {
    if (brushValue <= 3) return 8; // Smallest preview
    if (brushValue <= 5) return 12; // Medium preview
    return 16; // Large preview
  };

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 p-3 bg-slate-700/60 rounded-lg shadow-md mb-3 ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      {/* Color Selection */}
      <div className="flex items-center space-x-2" role="radiogroup" aria-label="ペンの色">
        {brushColors.map((color) => (
          <button
            key={color.value}
            type="button"
            title={`ペンの色を「${color.name}」に設定`}
            aria-label={`ペンの色を「${color.name}」に設定`}
            aria-checked={currentBrushColor === color.value}
            role="radio"
            onClick={() => onBrushColorChange(color.value)}
            disabled={isDisabled}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md border-2 transition-all duration-150 focus:outline-none
              ${currentBrushColor === color.value ? 'border-sky-300 ring-2 ring-sky-300 ring-offset-2 ring-offset-slate-700/60' : 'border-slate-500 hover:border-sky-400 focus:border-sky-400'}
              ${isDisabled ? 'opacity-50 !cursor-not-allowed hover:border-slate-500' : ''}`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>

      {/* Separator */}
      <div className={`h-6 w-px bg-slate-500 ${isDisabled ? 'opacity-50' : ''} hidden sm:block`}></div>

      {/* Brush Size Selection */}
      <div className="flex items-center space-x-2" role="radiogroup" aria-label="ペンの太さ">
        {brushSizes.map((size) => {
          const previewDiameter = getPreviewSize(size.value);
          return (
            <button
              key={size.value}
              type="button"
              title={`ペンの太さを「${size.label}」に設定`}
              aria-label={`ペンの太さを「${size.label}」に設定`}
              aria-checked={currentBrushSize === size.value}
              role="radio"
              onClick={() => onBrushSizeChange(size.value)}
              disabled={isDisabled}
              className={`p-1.5 sm:p-2 rounded-md border-2 flex items-center justify-center transition-all duration-150 focus:outline-none
                ${isDisabled ? '!cursor-not-allowed border-slate-600' : 
                currentBrushSize === size.value ? 'border-sky-300 bg-slate-600/70 ring-1 ring-sky-300 ring-offset-1 ring-offset-slate-700/60' : 'border-slate-500 hover:border-sky-400 focus:border-sky-400 hover:bg-slate-600/30'}`}
            >
              <div
                style={{
                  width: `${previewDiameter}px`,
                  height: `${previewDiameter}px`,
                  backgroundColor: currentBrushColor, // Show selected color in preview
                  borderRadius: '50%',
                }}
                className={`transition-colors duration-150 ${isDisabled ? 'bg-opacity-50' : ''}`}
              ></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
