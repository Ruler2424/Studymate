
import React, { useEffect, useRef } from 'react';
import { Chart } from './Chart.tsx';
import { ChatBubbleLeftRightIcon, SparklesIcon, UserCircleIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface TutorDisplayProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string;
}

// Re-implementing a simplified version of formatSolutionText from SolutionDisplay
// to avoid complex dependencies and keep the component self-contained.
const formatText = (text: string) => {
    const blocks = text.split(/(\n\n+)/);
    
    return blocks.map((block, index) => {
        if (block.trim() === '') return null;
        if (block.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{block.substring(2)}</h1>;
        if (block.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-3 mb-1">{block.substring(3)}</h2>;
        if (block.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-2 mb-1">{block.substring(4)}</h3>;
        
        if (block.startsWith('* ') || block.startsWith('- ')) {
            const items = block.split('\n').map((line, i) => <li key={i} className="ml-2">{line.substring(2)}</li>);
            return <ul key={index} className="list-disc pl-5 space-y-1">{items}</ul>;
        }

        if (/^\d+\.\s/.test(block)) {
            const items = block.split('\n').map((line, i) => <li key={i} className="ml-2">{line.replace(/^\d+\.\s/, '')}</li>);
            return <ol key={index} className="list-decimal pl-5 space-y-1">{items}</ol>;
        }

        const parts = block.split(/(\*\*.*?\*\*|`.*?`)/g);
        const formattedLine = parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={i} className="bg-slate-200 dark:bg-slate-700 rounded-md px-1.5 py-0.5 text-sm font-mono">{part.slice(1, -1)}</code>;
            }
            return part;
        });

        return <p key={index} className="my-2 leading-relaxed">{formattedLine}</p>;
    }).filter(Boolean);
};

const ChatContent: React.FC<{ text: string; isStreaming: boolean }> = ({ text, isStreaming }) => {
    const parts = text.split(/```json vega-lite\n([\s\S]*?)```/g);
  
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return <Chart key={index} spec={part} />;
          } else {
            if (part.trim() === '' && index === parts.length -1) return null; // Don't render empty trailing part
            const content = formatText(part);
            const isLastPart = index === parts.length - 1;
            return (
              <div key={index} className="inline">
                {content}
                {isStreaming && isLastPart && <span className="inline-block w-2 h-4 bg-slate-600 dark:bg-slate-300 animate-pulse ml-1" />}
              </div>
            );
          }
        })}
      </>
    );
};

export const TutorDisplay: React.FC<TutorDisplayProps> = ({ chatHistory, isLoading, error }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    if (chatHistory.length === 0) {
        return (
            <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[350px] flex justify-center items-center backdrop-blur-sm">
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                    <h3 className="text-xl font-semibold mt-4">{t('tutorDisplay.placeholderTitle')}</h3>
                    <p className="mt-2 max-w-xs mx-auto">{t('tutorDisplay.placeholderText')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-slate-900/80 p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <div ref={scrollRef} className="h-[500px] overflow-y-auto pr-2 space-y-6">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'model' && (
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
                                <SparklesIcon className="w-5 h-5 text-white" />
                           </div>
                       )}
                       <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' 
                           ? 'bg-indigo-600 text-white rounded-br-lg' 
                           : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-lg'}`
                       }>
                           <div className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                             <ChatContent text={msg.text} isStreaming={isLoading && index === chatHistory.length - 1} />
                           </div>
                       </div>
                       {msg.role === 'user' && (
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <UserCircleIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                           </div>
                       )}
                    </div>
                ))}
                {error && (
                    <div className="flex justify-start">
                         <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-3 rounded-xl text-red-700 dark:text-red-300 text-sm">
                            <p className="font-bold">{t('solutionDisplay.errorTitle')}</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};