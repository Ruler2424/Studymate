
export const translations = {
    en: {
        header: {
            title: 'Studymate',
        },
        modes: {
            solver: 'Solver',
            sketcher: 'Sketcher',
            scheduler: 'Scheduler',
            tutor: 'Tutor',
        },
        buttons: {
            solve: 'Solve Problem',
            solving: 'Solving...',
            generateSketch: 'Generate Sketch',
            sketching: 'Sketching...',
            generateSchedule: 'Generate Schedule',
            planning: 'Planning...',
            sendMessage: 'Send Message',
            replying: 'Replying...',
            downloadSketch: 'Download Sketch',
            applyEdit: 'Apply Edit with AI',
            applying: 'Applying...',
            addEvent: 'Add Event',
            cancel: 'Cancel',
            saveChanges: 'Save Changes',
            copy: 'Copy',
            copied: 'Copied!',
            cheatSheet: 'Cheat Sheet',
            creating: 'Creating...',
            practice: 'Practice',
            generating: 'Generating...',
        },
        homeworkInput: {
            solverPlaceholder: "Type your question here... e.g., 'What is the Pythagorean theorem?'",
            sketcherPlaceholder: "Describe the sketch you want to create... e.g., 'A simple diagram of a plant cell'",
            schedulerPlaceholder: "Describe your week... e.g., 'I have classes M/W/F from 9-11am, a job T/Th evenings, and need to study for a history exam.'",
            tutorPlaceholder: "Ask a question to start your tutoring session...",
            attachImage: "Attach an image",
            uploadButton: "Click or drag & drop to upload",
            uploadHint: "PNG, JPG, WEBP",
            removeImage: "Remove image",
        },
        solutionDisplay: {
            generating: 'Generating solution...',
            generatingHint: 'This may take a moment.',
            errorTitle: 'An Error Occurred',
            placeholderTitle: 'Your solution will appear here',
            placeholderText: 'Enter your problem above and let our AI helper find the answer for you!',
            solution: 'Solution',
            creatingCheatSheet: 'Creating your cheat sheet...',
            practiceProblems: 'Practice Problems',
            generatingPracticeProblems: 'Generating practice problems...',
        },
        sketchDisplay: {
            creating: 'Creating your sketch...',
            creatingHint: 'This can take a few seconds.',
            errorTitle: 'Could Not Generate Sketch',
            placeholderTitle: 'Your sketch will appear here',
            placeholderText: 'Describe the image you want to create and let AI bring it to life!',
            editTitle: 'Edit your sketch',
            editPlaceholder: "Describe your edit... e.g., 'add a sun to the top left corner'",
        },
        scheduleDisplay: {
            planning: 'Planning your schedule...',
            planningHint: 'This may take a moment.',
            errorTitle: 'Could Not Generate Schedule',
            placeholderTitle: 'Your schedule will appear here',
            placeholderText: 'Describe your week, tasks, and appointments to generate a plan.',
            weeklyPlan: 'Your Weekly Plan',
            noEvents: 'No events scheduled for today.',
            addEventTitle: 'Add event',
        },
        tutorDisplay: {
            placeholderTitle: 'AI Tutor',
            placeholderText: 'Start a conversation to get help with your homework, explain concepts, or practice problems.',
        },
        editModal: {
            title: 'Edit Event',
            time: 'Time',
            eventTitle: 'Title',
            description: 'Description',
            close: 'Close modal',
        },
        addModal: {
            title: 'Add New Event',
            timePlaceholder: 'e.g., 9:00 AM - 10:00 AM',
            titlePlaceholder: 'e.g., Study Session',
            descriptionPlaceholder: 'e.g., Review chapter 3 for history exam',
            validationAlert: 'Please fill in at least the time and title for the event.',
        },
        errors: {
            noPrompt: 'Please enter a question or upload an image.',
            noSketchPrompt: 'Please describe the sketch you want to create.',
            noEditPrompt: 'Please describe how you want to edit the sketch.',
            noSketchToEdit: 'There is no sketch to edit.',
            noSchedulePrompt: 'Please describe the schedule you want to create.',
        },
        disclaimer: {
            accuracy: "AI-generated answers may be inaccurate. Please verify important information."
        }
    },
    ru: {
        header: {
            title: 'Studymate',
        },
        modes: {
            solver: 'Решатель',
            sketcher: 'Эскиз',
            scheduler: 'Планировщик',
            tutor: 'Репетитор',
        },
        buttons: {
            solve: 'Решить задачу',
            solving: 'Решение...',
            generateSketch: 'Создать эскиз',
            sketching: 'Создание...',
            generateSchedule: 'Создать расписание',
            planning: 'Планирование...',
            sendMessage: 'Отправить',
            replying: 'Отвечаю...',
            downloadSketch: 'Скачать эскиз',
            applyEdit: 'Применить ИИ-правку',
            applying: 'Применение...',
            addEvent: 'Добавить событие',
            cancel: 'Отмена',
            saveChanges: 'Сохранить',
            copy: 'Копировать',
            copied: 'Скопировано!',
            cheatSheet: 'Шпаргалка',
            creating: 'Создание...',
            practice: 'Практика',
            generating: 'Генерация...',
        },
        homeworkInput: {
            solverPlaceholder: "Введите ваш вопрос... например, 'Что такое теорема Пифагора?'",
            sketcherPlaceholder: "Опишите эскиз, который вы хотите создать... например, 'Простая диаграмма растительной клетки'",
            schedulerPlaceholder: "Опишите вашу неделю... например, 'У меня занятия пн/ср/пт с 9 до 11, работа вт/чт вечерами, и нужно готовиться к экзамену по истории.'",
            tutorPlaceholder: "Задайте вопрос, чтобы начать занятие...",
            attachImage: "Прикрепить изображение",
            uploadButton: "Нажмите или перетащите файл для загрузки",
            uploadHint: "PNG, JPG, WEBP",
            removeImage: "Удалить изображение",
        },
        solutionDisplay: {
            generating: 'Генерация решения...',
            generatingHint: 'Это может занять некоторое время.',
            errorTitle: 'Произошла ошибка',
            placeholderTitle: 'Ваше решение появится здесь',
            placeholderText: 'Введите вашу задачу выше, и наш ИИ-помощник найдет для вас ответ!',
            solution: 'Решение',
            creatingCheatSheet: 'Создание шпаргалки...',
            practiceProblems: 'Практические задачи',
            generatingPracticeProblems: 'Генерация практических задач...',
        },
        sketchDisplay: {
            creating: 'Создание вашего эскиза...',
            creatingHint: 'Это может занять несколько секунд.',
            errorTitle: 'Не удалось создать эскиз',
            placeholderTitle: 'Ваш эскиз появится здесь',
            placeholderText: 'Опишите изображение, которое вы хотите создать, и пусть ИИ воплотит его в жизнь!',
            editTitle: 'Редактировать ваш эскиз',
            editPlaceholder: "Опишите вашу правку... например, 'добавить солнце в левый верхний угол'",
        },
        scheduleDisplay: {
            planning: 'Планирование вашего расписания...',
            planningHint: 'Это может занять некоторое время.',
            errorTitle: 'Не удалось создать расписание',
            placeholderTitle: 'Ваше расписание появится здесь',
            placeholderText: 'Опишите вашу неделю, задачи и встречи, чтобы составить план.',
            weeklyPlan: 'Ваш план на неделю',
            noEvents: 'На сегодня событий не запланировано.',
            addEventTitle: 'Добавить событие',
        },
        tutorDisplay: {
            placeholderTitle: 'ИИ-Репетитор',
            placeholderText: 'Начните диалог, чтобы получить помощь с домашним заданием, объяснение концепций или попрактиковаться.',
        },
        editModal: {
            title: 'Редактировать событие',
            time: 'Время',
            eventTitle: 'Название',
            description: 'Описание',
            close: 'Закрыть модальное окно',
        },
        addModal: {
            title: 'Добавить новое событие',
            timePlaceholder: 'например, 9:00 - 10:00',
            titlePlaceholder: 'например, Учебная сессия',
            descriptionPlaceholder: 'например, Повторить главу 3 для экзамена по истории',
            validationAlert: 'Пожалуйста, укажите хотя бы время и название события.',
        },
        errors: {
            noPrompt: 'Пожалуйста, введите вопрос или загрузите изображение.',
            noSketchPrompt: 'Пожалуйста, опишите эскиз, который вы хотите создать.',
            noEditPrompt: 'Пожалуйста, опишите, как вы хотите отредактировать эскиз.',
            noSketchToEdit: 'Нет эскиза для редактирования.',
            noSchedulePrompt: 'Пожалуйста, опишите расписание, которое вы хотите создать.',
        },
        disclaimer: {
            accuracy: "Ответы, сгенерированные ИИ, могут быть неточными. Пожалуйста, проверяйте важную информацию."
        }
    }
};

export type Language = keyof typeof translations;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`

type DotNestedKeys<T> = (T extends object ?
    { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
    : "") extends infer D ? Extract<D, string> : never;

export type TranslationKey = DotNestedKeys<typeof translations.en>;