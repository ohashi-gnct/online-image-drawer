
import React from 'react';
import { DownloadIcon, ClearIcon } from './Icon';

interface ToolbarProps {
  onDownload: () => void;
  onClear: () => void;
  isControlsDisabled: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onDownload,
  onClear,
  isControlsDisabled,
}) => {
  const commonButtonClasses = "w-full flex items-center justify-center px-4 py-2.5 border border-slate-600 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150";
  const activeButtonClasses = "text-sky-300 bg-slate-700 hover:bg-slate-600 focus:ring-sky-500";
  const disabledButtonClasses = "text-slate-500 bg-slate-600 cursor-not-allowed";

  return (
    <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
      <div className="space-y-3">
          <button
          type="button"
          onClick={onDownload}
          disabled={isControlsDisabled}
          className={`${commonButtonClasses} ${!isControlsDisabled ? activeButtonClasses : disabledButtonClasses}`}
          aria-disabled={isControlsDisabled}
          title="編集した画像をダウンロード"
          >
          <DownloadIcon className="w-4 h-4 mr-2" />
          画像をダウンロード
          </button>
          <button
          type="button"
          onClick={onClear}
          disabled={isControlsDisabled}
          className={`${commonButtonClasses} ${!isControlsDisabled ? activeButtonClasses : disabledButtonClasses}`}
          aria-disabled={isControlsDisabled}
          title="キャンバスの書き込みを消去"
          >
          <ClearIcon className="w-4 h-4 mr-2" />
          書き込みを消去
          </button>
      </div>
    </div>
  );
};
