
import React from 'react';
import { LoadingSpinnerIcon } from './Icon';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 space-y-2" role="status">
      <LoadingSpinnerIcon className="w-8 h-8 text-sky-400" />
      <p className="text-sm">画像を処理中...</p>
    </div>
  );
};
