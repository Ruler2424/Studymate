
import React from 'react';
import { Chart } from './Chart.tsx';
import { CopyButton } from './CopyButton.tsx';
import { ClipboardListIcon, LightBulbIcon, DocumentMagnifyingGlassIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface SolutionDisplayProps {
  solution: string;
  isLoading: boolean;
  error: string;
  cheatSheet: string;
  isCreatingCheatSheet: boolean;
  cheatSheetError: string;
  onCreateCheatSheet: () => void;
  practiceProblems: string;
  isGeneratingPracticeProblems: boolean;
  practiceProblemsError: string;
  onGeneratePracticeProblems: () => void;
}

const formatSolutionText = (text: string) => {
    // This is a simplified markdown-to-jsx converter. A more robust library could be used for complex cases.
    const blocks = text.split(/(\n\n+)/); // Split by double newlines to handle paragraphs
    
    return blocks.map((block, index) => {
        if (block.trim() === '') return null;

        // Headings
        if (block.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white">{block.substring(2)}</h1>;
        if (block.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-100">{block.substring(3)}</h2>;
        if (block.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100">{block.substring(4)}</h3>;
        
        // Unordered Lists
        if (block.startsWith('* ') || block.startsWith('- ')) {
            const items = block.split('\n').map((line, i) => <li key={i}>{line.substring(2)}</li>);
            return <ul key={index} className="list-disc pl-5 space-y-2">{items}</ul>;
        }

        // Ordered Lists
        if (/^\d+\.\s/.test(block)) {
            const items = block.split('\n').map((line, i) => <li key={i}>{line.replace(/^\d+\.\s/, '')}</li>);
            return <ol key={index} className="list-decimal pl-5 space-y-2">{items}</ol>;
        }

        // Paragraphs with bold text
        const parts = block.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-slate-800 dark:text-slate-100">{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        return <p key={index} className="my-3 leading-relaxed">{formattedLine}</p>;
    }).filter(Boolean);
};


const SolutionContent: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/```json vega-lite\n([\s\S]*?)```/g);
  
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return <Chart key={index} spec={part} />;
          } else {
            if (part.trim() === '') return null;
            return <div key={index}>{formatSolutionText(part)}</div>;
          }
        })}
      </>
    );
};

const SectionDisplay: React.FC<{ title: string; content: string; error: string; isLoading: boolean; children?: React.ReactNode; }> = ({ title, content, error, isLoading, children }) => {
    if (isLoading) {
        return (
             <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{children}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-4 rounded-xl text-red-700 dark:text-red-300">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!content) return null;

    return (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                <CopyButton textToCopy={content} />
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                 <SolutionContent text={content} />
            </div>
        </div>
    );
};


export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  solution,
  isLoading,
  error,
  cheatSheet,
  isCreatingCheatSheet,
  cheatSheetError,
  onCreateCheatSheet,
  practiceProblems,
  isGeneratingPracticeProblems,
  practiceProblemsError,
  onGeneratePracticeProblems,
}) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[250px] flex justify-center items-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium">{t('solutionDisplay.generating')}</span>
            <span className="text-sm">{t('solutionDisplay.generatingHint')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-6 rounded-2xl text-red-700 dark:text-red-300">
        <h3 className="font-bold text-lg">{t('solutionDisplay.errorTitle')}</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[250px] flex justify-center items-center backdrop-blur-sm">
        <div className="text-center text-slate-500 dark:text-slate-400">
            <DocumentMagnifyingGlassIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-semibold mt-4">{t('solutionDisplay.placeholderTitle')}</h3>
            <p className="mt-2 max-w-xs mx-auto">{t('solutionDisplay.placeholderText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('solutionDisplay.solution')}</h2>
        <div className="flex items-center gap-2 flex-wrap">
            <CopyButton textToCopy={solution} />
            <button 
                onClick={onCreateCheatSheet}
                disabled={isCreatingCheatSheet}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ClipboardListIcon className="w-5 h-5" />
                <span>{isCreatingCheatSheet ? t('buttons.creating') : t('buttons.cheatSheet')}</span>
            </button>
            <button 
                onClick={onGeneratePracticeProblems}
                disabled={isGeneratingPracticeProblems}
                className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/70 px-4 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <LightBulbIcon className="w-5 h-5" />
                <span>{isGeneratingPracticeProblems ? t('buttons.generating') : t('buttons.practice')}</span>
            </button>
        </div>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <SolutionContent text={solution} />
      </div>

      <SectionDisplay 
        title={t('buttons.cheatSheet')}
        content={cheatSheet}
        error={cheatSheetError}
        isLoading={isCreatingCheatSheet}
      >
        {t('solutionDisplay.creatingCheatSheet')}
      </SectionDisplay>

      <SectionDisplay 
        title={t('solutionDisplay.practiceProblems')}
        content={practiceProblems}
        error={practiceProblemsError}
        isLoading={isGeneratingPracticeProblems}
      >
        {t('solutionDisplay.generatingPracticeProblems')}
      </SectionDisplay>
    </div>
  );
};