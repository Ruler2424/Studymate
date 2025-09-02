
import React, { useState, useCallback } from 'react';
import { ClipboardCopyIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface CopyButtonProps {
  textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = useCallback(() => {
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied || !textToCopy}
      className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 px-4 py-2 rounded-full transition-colors disabled:opacity-70"
      aria-live="polite"
    >
      <ClipboardCopyIcon className="w-5 h-5" />
      <span>{isCopied ? t('buttons.copied') : t('buttons.copy')}</span>
    </button>
  );
};