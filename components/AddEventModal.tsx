
import React, { useState } from 'react';
import { ScheduleEvent } from '../services/geminiService.ts';
import { XCircleIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<ScheduleEvent, 'id'>) => void;
}

const initialEventState = {
  time: '',
  title: '',
  description: '',
};

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialEventState);
  const { t } = useLanguage();

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.time.trim()) {
        alert(t('addModal.validationAlert'));
        return;
    }
    onSave(formData);
    setFormData(initialEventState);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          aria-label={t('editModal.close')}
        >
          <XCircleIcon className="w-7 h-7" />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t('addModal.title')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('editModal.time')}</label>
            <input
              type="text"
              id="add-time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder={t('addModal.timePlaceholder')}
              className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="add-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('editModal.eventTitle')}</label>
            <input
              type="text"
              id="add-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('addModal.titlePlaceholder')}
              className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="add-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('editModal.description')}</label>
            <textarea
              id="add-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder={t('addModal.descriptionPlaceholder')}
              className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/60 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
            />
          </div>
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {t('buttons.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              {t('buttons.addEvent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};