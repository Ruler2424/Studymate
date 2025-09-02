
import React from 'react';
import { ScheduleData, ScheduleEvent } from '../services/geminiService.ts';
import { CalendarDaysIcon, PencilIcon, TrashIcon, PlusCircleIcon } from './icons.tsx';
import { CopyButton } from './CopyButton.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface ScheduleDisplayProps {
  schedule: ScheduleData | null;
  isLoading: boolean;
  error: string;
  onDeleteEvent: (dayIndex: number, eventId: string) => void;
  onEditEvent: (event: ScheduleEvent, dayIndex: number) => void;
  onOpenAddModal: (dayIndex: number) => void;
}

const scheduleToText = (schedule: ScheduleData): string => {
  return schedule.map(day => {
    const eventsText = day.events.map(event => 
      `- ${event.time}: ${event.title} (${event.description})`
    ).join('\n');
    return `${day.day}:\n${eventsText}`;
  }).join('\n\n');
};

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule, isLoading, error, onDeleteEvent, onEditEvent, onOpenAddModal }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[350px] flex justify-center items-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
            <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium">{t('scheduleDisplay.planning')}</span>
            <span className="text-sm">{t('scheduleDisplay.planningHint')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 p-6 rounded-2xl text-red-700 dark:text-red-300">
        <h3 className="font-bold text-lg">{t('scheduleDisplay.errorTitle')}</h3>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="w-full bg-white dark:bg-slate-900/80 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 min-h-[350px] flex justify-center items-center backdrop-blur-sm">
        <div className="text-center text-slate-500 dark:text-slate-400">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h3 className="text-xl font-semibold mt-4">{t('scheduleDisplay.placeholderTitle')}</h3>
            <p className="mt-2 max-w-xs mx-auto">{t('scheduleDisplay.placeholderText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('scheduleDisplay.weeklyPlan')}</h2>
            <CopyButton textToCopy={scheduleToText(schedule)} />
        </div>
        <div className="space-y-6">
            {schedule.map((day, dayIndex) => (
                <div key={dayIndex}>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{day.day}</h3>
                        <button
                          onClick={() => onOpenAddModal(dayIndex)}
                          title={t('scheduleDisplay.addEventTitle')}
                          className="flex items-center gap-1.5 p-1.5 rounded-md text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                        >
                          <PlusCircleIcon className="w-5 h-5" />
                          <span>{t('buttons.addEvent')}</span>
                        </button>
                    </div>
                    <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                        {day.events.length > 0 ? day.events.map((event) => (
                            <div key={event.id} className="relative group">
                                <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full border-2 border-white dark:border-slate-900"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm">{event.time}</p>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100">{event.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-300">{event.description}</p>
                                    </div>
                                    <div className="absolute top-0 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => onEditEvent(event, dayIndex)}
                                            title="Edit event"
                                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteEvent(dayIndex, event.id)}
                                            title="Delete event"
                                            className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-slate-500 dark:text-slate-400 italic">{t('scheduleDisplay.noEvents')}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};