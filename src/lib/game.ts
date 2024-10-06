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
};

export type GameEvents =
  | { type: 'SELECT'; difficulty: number }
  | { type: 'ANSWER'; index: number }
  | { type: 'RESTART' }
  | { type: 'NEXT' };

const generateQuestions = (difficulty: number): Question[] => {
  const shuffledProvinces = shuffleArray(provinces);
  return shuffledProvinces.slice(0, 10).map((province) => {
    const correctAnswer = province.options.find((opt) => opt.correct)!;
    const incorrectOptions = shuffleArray(
      province.options.filter((opt) => !opt.correct && opt.difficulty <= difficulty)
    ).slice(0, 3);

    const answers = shuffleArray([correctAnswer, ...incorrectOptions]);

    return {
      question: province.province,
      answers,
    };
  });
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
      };
    }),
    selectNewQuestion: assign(({ context }) => {
      const currentQuestion = context.questions[context.currentQuestionIndex];
      return {
        currentQuestion,
      };
    }),
    reviewAnswer: assign(({ context, event }) => {
      if (event.type !== 'ANSWER') return context;

      const isCorrect = context.currentQuestion?.answers[event.index].correct ?? false;
      const newScore = context.score + (isCorrect ? 1 : 0);

      return {
        lastResult: isCorrect,
        results: [...context.results, isCorrect],
        score: newScore,
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
      states: {
        question: {
          entry: 'selectNewQuestion',
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
