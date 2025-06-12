
import React from 'react';
import { ErrorIcon } from './Icon';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-700/30 border border-red-600 text-red-300 px-4 py-3 rounded-md relative flex items-start space-x-2" role="alert">
      <ErrorIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div>
        <strong className="font-semibold block">エラー</strong>
        <span className="block sm:inline text-sm">{message}</span>
      </div>
    </div>
  );
};
