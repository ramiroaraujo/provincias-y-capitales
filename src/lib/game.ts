import { provinces } from './provinces.ts';

export type Level = { id: number; name: string; options: number; seconds: number };

export const levels: Level[] = [
  { id: 1, name: 'Fácil', options: 3, seconds: 15 },
  { id: 2, name: 'Medio', options: 4, seconds: 7 },
  { id: 3, name: 'Difícil', options: 5, seconds: 4 },
];

export type Question = { province: string; capital: string; options: string[] };

export const shuffle = <T>(array: T[]): T[] => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const buildQuestions = (level: Level): Question[] =>
  shuffle(provinces).map(({ province, capital, cities }) => ({
    province,
    capital,
    options: shuffle([capital, ...shuffle(cities).slice(0, level.options - 1)]),
  }));

const cheers = [
  '¡Bien ahí!',
  '¡Golazo!',
  '¡Qué capo/a!',
  '¡Sos un crack!',
  '¡La rompiste!',
  '¡Sos un fenómeno!',
  '¡Qué grande!',
  '¡Excelente, che!',
  '¡Impecable!',
];

const oops = [
  '¡Uh, le erraste!',
  '¡Casi, casi!',
  '¡Apa, no era esa!',
  '¡Uh, la próxima sale!',
  '¡No pasa nada, che!',
  '¡Tranqui, la próxima va!',
  '¡Dale que la próxima sale!',
];

export const expression = (ok: boolean) => shuffle(ok ? cheers : oops)[0];
