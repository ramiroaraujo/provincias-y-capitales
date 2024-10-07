import { assign, setup } from 'xstate';
import { shuffleArray } from '@/lib/utils';
import { provinces } from '@/lib/provinces';

export type Question = {
  question: string;
  answers: Answer[];
};

export type Answer = {
  name: string;
  correct: boolean;
  difficulty: number;
};

export type GameContext = {
  difficulty: number;
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestion?: Question;
  lastResult?: boolean;
  results: boolean[];
  score: number;
  timeTaken: number;
  questionStartTime?: number;
};

export type GameEvents =
  | { type: 'SELECT'; difficulty: number }
  | { type: 'ANSWER'; index: number }
  | { type: 'RESTART' }
  | { type: 'NEXT' };

const generateQuestions = (difficulty: number): Question[] => {
  const shuffledProvinces = shuffleArray(provinces);
  const numAnswers = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  return shuffledProvinces.map((province) => {
    const correctAnswer = province.options.find((opt) => opt.correct)!;
    const incorrectOptions = shuffleArray(
      province.options.filter((opt) => !opt.correct && opt.difficulty <= difficulty)
    ).slice(0, numAnswers - 1);

    const answers = shuffleArray([correctAnswer, ...incorrectOptions]);

    return {
      question: province.province,
      answers,
    };
  });
};

export const timeLimit = {
  1: 15000,
  2: 6000,
  3: 3000,
};

export const machine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvents,
  },
  guards: {
    hasMoreQuestions: ({ context }) => {
      return context.currentQuestionIndex < context.questions.length - 1;
    },
    isTimeLimit: ({ context }) => {
      const currentTime = Date.now();
      const timeLimitForDifficulty = timeLimit[context.difficulty as 1 | 2 | 3];
      return currentTime - context.questionStartTime! >= timeLimitForDifficulty;
    },
  },
  actions: {
    selectDifficulty: assign(({ context, event }) => {
      if (event.type !== 'SELECT') return context;

      const questions = generateQuestions(event.difficulty);

      return {
        difficulty: event.difficulty,
        questions,
        currentQuestionIndex: 0,
        results: [],
        score: 0,
        currentQuestion: questions[0],
        timeTaken: 0,
        questionStartTime: Date.now(),
        lastResult: undefined,
      };
    }),
    selectNewQuestion: assign(({ context }) => {
      const currentQuestion = context.questions[context.currentQuestionIndex];
      return {
        currentQuestion,
        questionStartTime: Date.now(),
        lastResult: undefined,
      };
    }),
    timeout: assign(({ context }) => {
      const questionEndTime = Date.now();
      const questionTime = context.questionStartTime
        ? questionEndTime - context.questionStartTime
        : 0;
      return {
        lastResult: false,
        results: [...context.results, false],
        timeTaken: context.timeTaken + questionTime,
        questionStartTime: undefined,
      };
    }),
    reviewAnswer: assign(({ context, event }) => {
      if (event.type !== 'ANSWER') return context;

      const isCorrect = context.currentQuestion?.answers[event.index]?.correct ?? false;
      const newScore = context.score + (isCorrect ? 1 : 0);
      const questionEndTime = Date.now();
      const questionTime = context.questionStartTime
        ? questionEndTime - context.questionStartTime
        : 0;

      return {
        lastResult: isCorrect,
        results: [...context.results, isCorrect],
        score: newScore,
        timeTaken: context.timeTaken + questionTime,
        questionStartTime: undefined,
      };
    }),
    incrementQuestionIndex: assign(({ context }) => {
      return {
        currentQuestionIndex: context.currentQuestionIndex + 1,
      };
    }),
    resetGame: assign(() => {
      return {
        difficulty: 1,
        questions: [],
        currentQuestionIndex: 0,
        currentQuestion: undefined,
        lastResult: undefined,
        results: [],
        score: 0,
        timeTaken: 0,
        questionStartTime: undefined,
      };
    }),
  },
}).createMachine({
  context: {
    difficulty: 1,
    questions: [],
    currentQuestionIndex: 0,
    results: [],
    score: 0,
    timeTaken: 0,
  },
  id: 'game',
  initial: 'difficultySelection',
  states: {
    difficultySelection: {
      on: {
        SELECT: {
          actions: 'selectDifficulty',
          target: 'playing',
        },
      },
    },
    playing: {
      initial: 'question',
      on: {
        RESTART: {
          actions: 'resetGame',
          target: 'difficultySelection',
        },
      },
      states: {
        question: {
          entry: 'selectNewQuestion',
          after: {
            3000: {
              guard: 'isTimeLimit',
              actions: 'timeout',
              target: 'result',
            },
            6000: {
              guard: 'isTimeLimit',
              actions: 'timeout',
              target: 'result',
            },
            15000: {
              guard: 'isTimeLimit',
              actions: 'timeout',
              target: 'result',
            },
          },
          on: {
            ANSWER: {
              actions: 'reviewAnswer',
              target: 'result',
            },
          },
        },
        result: {
          on: {
            NEXT: {
              target: 'next',
            },
          },
          after: {
            2500: {
              target: 'next',
            },
          },
        },
        next: {
          always: [
            {
              target: 'question',
              actions: 'incrementQuestionIndex',
              guard: 'hasMoreQuestions',
            },
            {
              target: '#game.gameOver',
            },
          ],
        },
      },
    },
    gameOver: {
      on: {
        RESTART: {
          actions: 'resetGame',
          target: 'difficultySelection',
        },
      },
    },
  },
});
