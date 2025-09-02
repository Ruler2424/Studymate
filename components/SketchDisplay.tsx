
import React from 'react';
import { ArrowDownTrayIcon, PhotoIcon, SparklesIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface SketchDisplayProps {
  sketchUrl: string;
  isLoading: boolean;
  error: string;
  prompt: string;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  isEditing: boolean;
  editError: string;
  onEdit: () => void;
}

const downloadImage = (base64Image: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64Image}`;
    // Sanitize prompt to create a valid filename
    const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeFileName || 'sketch'}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const SketchDisplay: React.FC<SketchDisplayProps> = ({ sketchUrl, isLoading, error, prompt, editPrompt, setEditPrompt, isEditing, editError, onEdit }) => {
  const { t } = useLanguage();
    
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[350px] flex justify-center items-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium">{t('sketchDisplay.creating')}</span>
            <span className="text-sm">{t('sketchDisplay.creatingHint')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-6 rounded-2xl text-red-700 dark:text-red-300">
        <h3 className="font-bold text-lg">{t('sketchDisplay.errorTitle')}</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!sketchUrl) {
    return (
      <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[350px] flex justify-center items-center backdrop-blur-sm">
        <div className="text-center text-slate-500 dark:text-slate-400">
            <PhotoIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-semibold mt-4">{t('sketchDisplay.placeholderTitle')}</h3>
            <p className="mt-2 max-w-xs mx-auto">{t('sketchDisplay.placeholderText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900/80 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm space-y-4">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
         <img 
            src={`data:image/jpeg;base64,${sketchUrl}`} 
            alt={prompt} 
            className={`w-full h-full object-contain transition-opacity duration-300 ${isEditing ? 'opacity-40' : 'opacity-100'}`}
        />
        {isEditing && (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/30 backdrop-blur-sm">
                <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white font-semibold mt-4">{t('buttons.applying')}</span>
            </div>
        )}
      </div>
      <div className="flex justify-end">
        <button 
            onClick={() => downloadImage(sketchUrl, prompt)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 px-4 py-2 rounded-full transition-colors">
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>{t('buttons.downloadSketch')}</span>
        </button>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t('sketchDisplay.editTitle')}</h3>
        <div className="flex gap-2">
            <input 
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder={t('sketchDisplay.editPlaceholder')}
                className="flex-grow w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                disabled={isEditing}
            />
            <button 
                onClick={onEdit}
                disabled={isEditing || !editPrompt}
                className="flex items-center justify-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                {isEditing ? (
                    <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>{t('buttons.applying')}</span>
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>{t('buttons.applyEdit')}</span>
                    </>
                )}
            </button>
        </div>
        {editError && <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>}
      </div>
    </div>
  );
};