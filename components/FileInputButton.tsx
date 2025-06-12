
import React, { useRef } from 'react';
import { UploadIcon } from './Icon';

interface FileInputButtonProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const FileInputButton: React.FC<FileInputButtonProps> = ({ onFileSelected, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    // Reset file input to allow selecting the same file again
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        className="hidden"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-150"
      >
        <UploadIcon className="w-5 h-5 mr-2" />
        画像ファイルを開く
      </button>
    </>
  );
};
