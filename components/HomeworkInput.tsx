
import React, { useRef, useState } from 'react';
import { PaperClipIcon, XCircleIcon, UploadCloudIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface HomeworkInputProps {
  mode: 'solver' | 'sketcher' | 'scheduler' | 'tutor';
  prompt: string;
  setPrompt: (prompt: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isLoading: boolean;
}

export const HomeworkInput: React.FC<HomeworkInputProps> = ({
  mode,
  prompt,
  setPrompt,
  imageFile,
  setImageFile,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'solver') setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'solver') setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'solver') {
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        setImageFile(file);
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPlaceholderText = () => {
    switch (mode) {
      case 'solver':
        return t('homeworkInput.solverPlaceholder');
      case 'sketcher':
        return t('homeworkInput.sketcherPlaceholder');
      case 'scheduler':
        return t('homeworkInput.schedulerPlaceholder');
      case 'tutor':
        return t('homeworkInput.tutorPlaceholder');
      default:
        return "Type your prompt here...";
    }
  };

  return (
    <div 
      className="space-y-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={getPlaceholderText()}
          className="w-full h-32 p-4 pr-12 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
          disabled={isLoading}
        />
        {mode === 'solver' && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              disabled={isLoading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title={t('homeworkInput.attachImage')}
              disabled={isLoading}
              className="absolute top-3 right-3 p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <PaperClipIcon className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {mode === 'solver' && !imageFile && (
         <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-6 rounded-xl transition-all duration-300 ${isDragging ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500' : 'bg-white dark:bg-slate-800/40'}`}
        >
            <UploadCloudIcon className="w-8 h-8"/>
            <span className="font-semibold">{t('homeworkInput.uploadButton')}</span>
            <span className="text-sm">{t('homeworkInput.uploadHint')}</span>
        </button>
      )}

      {mode === 'solver' && imageFile && (
        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
              {imageFile.name}
            </span>
          </div>
          <button
            onClick={removeImage}
            disabled={isLoading}
            className="p-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 rounded-full flex-shrink-0"
            title={t('homeworkInput.removeImage')}
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};