
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat } from '@google/genai';
import { solveHomework, createCheatSheet, generatePracticeProblems, generateSketch, editSketch, generateSchedule, ScheduleData, ScheduleEvent, startTutorChat, detectLanguage } from '../services/geminiService.ts';
import { Header } from './Header.tsx';
import { HomeworkInput } from './HomeworkInput.tsx';
import { SolutionDisplay } from './SolutionDisplay.tsx';
import { SketchDisplay } from './SketchDisplay.tsx';
import { ScheduleDisplay } from './ScheduleDisplay.tsx';
import { TutorDisplay, ChatMessage } from './TutorDisplay.tsx';
import { EditEventModal } from './EditEventModal.tsx';
import { AddEventModal } from './AddEventModal.tsx';
import { SparklesIcon, PaintBrushIcon, CalendarDaysIcon, ChatBubbleLeftRightIcon } from './icons.tsx';
import { useLanguage } from '../contexts/LanguageContext.tsx';

type Mode = 'solver' | 'sketcher' | 'scheduler' | 'tutor';

const App: React.FC = () => {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<Mode>('solver');
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Solver state
  const [solution, setSolution] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cheatSheet, setCheatSheet] = useState<string>('');
  const [isCreatingCheatSheet, setIsCreatingCheatSheet] = useState<boolean>(false);
  const [cheatSheetError, setCheatSheetError] = useState<string>('');
  const [practiceProblems, setPracticeProblems] = useState<string>('');
  const [isGeneratingPracticeProblems, setIsGeneratingPracticeProblems] = useState<boolean>(false);
  const [practiceProblemsError, setPracticeProblemsError] = useState<string>('');

  // Sketcher state
  const [sketchUrl, setSketchUrl] = useState<string>('');
  const [isSketching, setIsSketching] = useState<boolean>(false);
  const [sketchError, setSketchError] = useState<string>('');
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditingSketch, setIsEditingSketch] = useState<boolean>(false);
  const [editSketchError, setEditSketchError] = useState<string>('');

  // Scheduler state
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduleError, setScheduleError] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<{ event: ScheduleEvent; dayIndex: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addingToDayIndex, setAddingToDayIndex] = useState<number | null>(null);

  // Tutor state
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [tutorError, setTutorError] = useState<string>('');


  const resetSolverState = () => {
    setSolution('');
    setError('');
    setCheatSheet('');
    setCheatSheetError('');
    setPracticeProblems('');
    setPracticeProblemsError('');
    setImageFile(null);
  };
  
  const resetSketcherState = () => {
    setSketchUrl('');
    setSketchError('');
    setEditPrompt('');
    setEditSketchError('');
  };

  const resetSchedulerState = () => {
    setSchedule(null);
    setScheduleError('');
  };

  const resetTutorState = () => {
    setChat(null);
    setChatHistory([]);
    setTutorError('');
  };

  const handleModeChange = (newMode: Mode) => {
    if (mode !== newMode) {
      setMode(newMode);
      setPrompt('');
      resetSolverState();
      resetSketcherState();
      resetSchedulerState();
      resetTutorState();
    }
  };

  const handleSolve = useCallback(async () => {
    if (!prompt && !imageFile) {
      setError(t('errors.noPrompt'));
      return;
    }
    setIsLoading(true);
    resetSolverState();
    try {
      // Use UI language as a fallback if only an image is provided
      const result = await solveHomework(prompt, imageFile, language);
      setSolution(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, imageFile, language, t]);

  const handleGenerateSketch = useCallback(async () => {
    if (!prompt) {
      setSketchError(t('errors.noSketchPrompt'));
      return;
    }
    setIsSketching(true);
    resetSketcherState();
    try {
      const result = await generateSketch(prompt);
      setSketchUrl(result);
    } catch (err: any) {
      console.error(err);
      setSketchError(err.message || 'Could not generate the sketch. Please try again.');
    } finally {
      setIsSketching(false);
    }
  }, [prompt, t]);

  const handleEditSketch = useCallback(async () => {
    if (!editPrompt) {
      setEditSketchError(t('errors.noEditPrompt'));
      return;
    }
    if (!sketchUrl) {
        setEditSketchError(t('errors.noSketchToEdit'));
        return;
    }
    setIsEditingSketch(true);
    setEditSketchError('');

    try {
      const result = await editSketch(sketchUrl, editPrompt);
      setSketchUrl(result); // Replace the old sketch with the new one
      setEditPrompt(''); // Clear the edit prompt
    } catch (err: any) {
      console.error(err);
      setEditSketchError(err.message || 'Could not edit the sketch. Please try again.');
    } finally {
      setIsEditingSketch(false);
    }
  }, [editPrompt, sketchUrl, t]);

  const handleGenerateSchedule = useCallback(async () => {
    if (!prompt) {
      setScheduleError(t('errors.noSchedulePrompt'));
      return;
    }
    setIsScheduling(true);
    resetSchedulerState();
    try {
      const result = await generateSchedule(prompt);
      setSchedule(result);
    } catch (err: any) {
      console.error(err);
      setScheduleError(err.message || 'Could not generate the schedule. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  }, [prompt, t]);

  const handleSendMessage = useCallback(async () => {
    if (!prompt) return;
  
    const userMessage: ChatMessage = { role: 'user', text: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt('');
    setIsReplying(true);
    setTutorError('');
  
    try {
      let activeChat = chat;
      if (!activeChat) {
        const detectedLanguage = await detectLanguage(currentPrompt);
        activeChat = startTutorChat(detectedLanguage);
        setChat(activeChat);
      }
  
      if (!activeChat) {
        throw new Error("Could not initialize the tutor chat.");
      }
  
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]);
      
      const stream = await activeChat.sendMessageStream({ message: currentPrompt });
      
      let modelResponse = '';
      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'model', text: modelResponse };
          return newHistory;
        });
      }
    } catch (err: any) {
      console.error(err);
      setTutorError(err.message || 'An error occurred. Please try again.');
      setChatHistory(prev => prev.slice(0, -1)); // Remove the empty model message on error
    } finally {
      setIsReplying(false);
    }
  }, [prompt, chat]);
  
  const handleCreateCheatSheet = useCallback(async () => {
    if (!solution || !prompt) return;
    setIsCreatingCheatSheet(true);
    setCheatSheetError('');
    setCheatSheet('');
    try {
      const result = await createCheatSheet(solution, prompt);
      setCheatSheet(result);
    } catch (err: any) {
      console.error(err);
      setCheatSheetError(err.message || 'Could not create cheat sheet. Please try again.');
    } finally {
      setIsCreatingCheatSheet(false);
    }
  }, [solution, prompt]);

  const handleGeneratePracticeProblems = useCallback(async () => {
    if (!solution || !prompt) return;
    setIsGeneratingPracticeProblems(true);
    setPracticeProblemsError('');
    setPracticeProblems('');
    try {
      const result = await generatePracticeProblems(prompt, solution);
      setPracticeProblems(result);
    } catch (err: any) {
      console.error(err);
      setPracticeProblemsError(err.message || 'Could not generate practice problems. Please try again.');
    } finally {
      setIsGeneratingPracticeProblems(false);
    }
  }, [prompt, solution]);

  const handleDeleteEvent = useCallback((dayIndex: number, eventId: string) => {
    setSchedule(currentSchedule => {
        if (!currentSchedule) return null;
        const newSchedule = [...currentSchedule];
        const dayToUpdate = { ...newSchedule[dayIndex] };
        dayToUpdate.events = dayToUpdate.events.filter(event => event.id !== eventId);
        newSchedule[dayIndex] = dayToUpdate;
        return newSchedule;
    });
  }, []);

  const handleOpenEditModal = useCallback((event: ScheduleEvent, dayIndex: number) => {
    setEditingEvent({ event, dayIndex });
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  }, []);

  const handleSaveEvent = useCallback((updatedEvent: ScheduleEvent) => {
    if (!editingEvent) return;
    setSchedule(currentSchedule => {
      if (!currentSchedule) return null;
      const newSchedule = [...currentSchedule];
      const dayToUpdate = { ...newSchedule[editingEvent.dayIndex] };
      dayToUpdate.events = dayToUpdate.events.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      newSchedule[editingEvent.dayIndex] = dayToUpdate;
      return newSchedule;
    });
    handleCloseEditModal();
  }, [editingEvent, handleCloseEditModal]);

  const handleOpenAddModal = useCallback((dayIndex: number) => {
      setAddingToDayIndex(dayIndex);
      setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
      setIsAddModalOpen(false);
      setAddingToDayIndex(null);
  }, []);

  const handleAddEvent = useCallback((newEventData: Omit<ScheduleEvent, 'id'>) => {
      if (addingToDayIndex === null) return;
      const newEvent: ScheduleEvent = {
          ...newEventData,
          id: uuidv4(),
      };
      setSchedule(currentSchedule => {
          if (!currentSchedule) return null;
          const newSchedule = [...currentSchedule];
          const dayToUpdate = { ...newSchedule[addingToDayIndex] };
          dayToUpdate.events = [...dayToUpdate.events, newEvent].sort((a,b) => a.time.localeCompare(b.time));
          newSchedule[addingToDayIndex] = dayToUpdate;
          return newSchedule;
      });
      handleCloseAddModal();
  }, [addingToDayIndex, handleCloseAddModal]);
  
  const modeOptions = [
    { id: 'solver', label: t('modes.solver'), icon: <SparklesIcon className="w-5 h-5" /> },
    { id: 'sketcher', label: t('modes.sketcher'), icon: <PaintBrushIcon className="w-5 h-5" /> },
    { id: 'scheduler', label: t('modes.scheduler'), icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { id: 'tutor', label: t('modes.tutor'), icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
  ];

  const isLoadingAny = isLoading || isSketching || isScheduling || isReplying;

  const getActionButton = () => {
    const commonProps = {
      className: "w-full flex items-center justify-center gap-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500/50 dark:focus:ring-offset-slate-950",
    };
    
    switch (mode) {
      case 'solver':
        return <button onClick={handleSolve} disabled={isLoadingAny || (!prompt && !imageFile)} {...commonProps}>
            {isLoading ? t('buttons.solving') : t('buttons.solve')} <SparklesIcon className="w-6 h-6" />
          </button>;
      case 'sketcher':
        return <button onClick={handleGenerateSketch} disabled={isLoadingAny || !prompt} {...commonProps}>
            {isSketching ? t('buttons.sketching') : t('buttons.generateSketch')} <PaintBrushIcon className="w-6 h-6" />
          </button>;
      case 'scheduler':
        return <button onClick={handleGenerateSchedule} disabled={isLoadingAny || !prompt} {...commonProps}>
            {isScheduling ? t('buttons.planning') : t('buttons.generateSchedule')} <CalendarDaysIcon className="w-6 h-6" />
          </button>;
      case 'tutor':
        return <button onClick={handleSendMessage} disabled={isLoadingAny || !prompt} {...commonProps}>
            {isReplying ? t('buttons.replying') : t('buttons.sendMessage')} <ChatBubbleLeftRightIcon className="w-6 h-6" />
          </button>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-2 bg-slate-100 dark:bg-slate-900/80 rounded-full shadow-inner border border-slate-200 dark:border-slate-800 backdrop-blur-sm sticky top-[70px] z-10">
          {modeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleModeChange(option.id as Mode)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-950 ${
                mode === option.id
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="md:sticky top-[140px] space-y-4">
            <HomeworkInput
              mode={mode}
              prompt={prompt}
              setPrompt={setPrompt}
              imageFile={imageFile}
              setImageFile={setImageFile}
              isLoading={isLoadingAny}
            />
            {getActionButton()}
          </div>

          <div className="row-start-1 md:row-start-auto">
            {mode === 'solver' && <SolutionDisplay
                solution={solution} isLoading={isLoading} error={error}
                cheatSheet={cheatSheet} isCreatingCheatSheet={isCreatingCheatSheet} cheatSheetError={cheatSheetError} onCreateCheatSheet={handleCreateCheatSheet}
                practiceProblems={practiceProblems} isGeneratingPracticeProblems={isGeneratingPracticeProblems} practiceProblemsError={practiceProblemsError} onGeneratePracticeProblems={handleGeneratePracticeProblems}
              />}
            {mode === 'sketcher' && <SketchDisplay
                sketchUrl={sketchUrl} isLoading={isSketching} error={sketchError} prompt={prompt}
                editPrompt={editPrompt} setEditPrompt={setEditPrompt} isEditing={isEditingSketch} editError={editSketchError} onEdit={handleEditSketch}
              />}
            {mode === 'scheduler' && <ScheduleDisplay
                schedule={schedule} isLoading={isScheduling} error={scheduleError}
                onDeleteEvent={handleDeleteEvent} onEditEvent={handleOpenEditModal} onOpenAddModal={handleOpenAddModal}
              />}
            {mode === 'tutor' && <TutorDisplay chatHistory={chatHistory} isLoading={isReplying} error={tutorError} />}
          </div>
        </div>
      </main>

      <footer className="w-full text-center p-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('disclaimer.accuracy')}
        </p>
      </footer>

      {isEditModalOpen && editingEvent && <EditEventModal
          isOpen={isEditModalOpen} event={editingEvent.event}
          onClose={handleCloseEditModal} onSave={handleSaveEvent}
        />}
      {isAddModalOpen && <AddEventModal
          isOpen={isAddModalOpen} onClose={handleCloseAddModal} onSave={handleAddEvent}
        />}
    </div>
  );
};

export default App;