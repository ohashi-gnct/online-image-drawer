
import React from 'react';
import { ImagePlaceholderIcon } from './Icon';

export const PlaceholderInstructions: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center text-slate-500 p-8">
      <ImagePlaceholderIcon className="w-16 h-16 mb-4 text-slate-600" />
      <h3 className="text-xl font-semibold text-slate-400 mb-2">画像がありません</h3>
      <p className="text-sm">
        ボタンから画像をアップロードするか、
        <br />
        クリップボードから画像をペーストしてください。
      </p>
    </div>
  );
};
