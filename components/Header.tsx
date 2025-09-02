
import React from 'react';
import { BookOpenIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-md">
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            {t('header.title')}
          </span>
        </div>
      </div>
    </header>
  );
};
