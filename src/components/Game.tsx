'use client';

import { useEffect, useRef, useState } from 'react';
import { buildQuestions, expression, levels, type Level, type Question } from '@/lib/game';
import { capitals, paths, viewBox } from '@/lib/map';

const play = (sound: 'tap' | 'right' | 'wrong') => {
  new Audio(`/sounds/${sound}.webm`).play().catch(() => {});
};

function ArgentinaMap({ province, showCapital }: { province?: string; showCapital: boolean }) {
  const dot = province && showCapital ? capitals[province] : undefined;
  return (
    <svg viewBox={viewBox} role="img" aria-label="Mapa de Argentina" preserveAspectRatio="xMidYMin meet" className="h-full w-full">
      {Object.entries(paths).map(([name, d]) => (
        <path
          key={name}
          d={d}
          className={`stroke-(--map-line) transition-[fill] duration-300 ${
            name === province ? 'fill-(--sun)' : 'fill-(--map)'
          }`}
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      ))}
      {dot && (
        <g transform={`translate(${dot[0]} ${dot[1]})`}>
          <circle r={14} className="animate-ping fill-(--ink) opacity-40 [transform-box:fill-box] origin-center" />
          <circle r={6.5} className="fill-(--ink) stroke-white" strokeWidth={2} />
        </g>
      )}
    </svg>
  );
}

export default function Game() {
  const [level, setLevel] = useState<Level>(levels[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  // undefined = still answering, null = ran out of time
  const [picked, setPicked] = useState<string | null>();
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<boolean[]>([]);
  const startedAt = useRef(0);
  const [elapsed, setElapsed] = useState(0);

  const playing = questions.length > 0 && index < questions.length;
  const over = questions.length > 0 && index >= questions.length;
  const q = playing ? questions[index] : undefined;
  const answered = picked !== undefined;

  const answer = (option: string | null) => {
    if (!q || answered) return;
    const ok = option === q.capital;
    play(ok ? 'right' : 'wrong');
    setPicked(option);
    setMessage(option === null ? '¡Se acabó el tiempo!' : expression(ok));
    setResults((r) => [...r, ok]);
  };

  useEffect(() => {
    if (!playing || answered) return;
    const t = setTimeout(() => answer(null), level.seconds * 1000);
    return () => clearTimeout(t);
  });

  const start = () => {
    play('tap');
    setQuestions(buildQuestions(level));
    setIndex(0);
    setPicked(undefined);
    setResults([]);
    startedAt.current = Date.now();
  };

  const next = () => {
    play('tap');
    if (index + 1 >= questions.length) setElapsed(Date.now() - startedAt.current);
    setIndex(index + 1);
    setPicked(undefined);
  };

  const quit = () => {
    play('tap');
    setQuestions([]);
  };

  const score = results.filter(Boolean).length;

  return (
    <main className="mx-auto flex h-svh w-full max-w-5xl flex-col gap-4 px-4 py-5 md:h-auto md:min-h-svh md:py-8">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold tracking-tight md:text-3xl">
          Provincias <span className="text-(--accent)">y</span> Capitales
        </h1>
        {playing && (
          <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap md:text-base">
            <span className="rounded-full bg-(--card) px-3 py-1 shadow-sm">
              {index + 1}/{questions.length}
            </span>
            <span className="rounded-full bg-(--ok) px-3 py-1 text-white shadow-sm">✓ {score}</span>
            <button onClick={quit} aria-label="Salir" className="rounded-full bg-(--card) px-3 py-1 shadow-sm">
              ✕
            </button>
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-8">
        <div className="min-h-40 w-full flex-1 md:sticky md:top-4 md:h-[78svh] md:max-h-[760px] md:flex-none">
          <ArgentinaMap province={q?.province} showCapital={answered} />
        </div>

        <section className="flex shrink-0 flex-col gap-3 md:gap-4 md:self-center">
          {!playing && !over && (
            <>
              <p className="md:text-lg">
                Te muestro una provincia en el mapa y tenés que elegir su capital antes de que se
                acabe el tiempo.
              </p>
              <h2 className="text-sm font-bold tracking-wide text-(--muted) uppercase">
                Elegí la dificultad
              </h2>
              <div className="flex flex-col gap-2">
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      play('tap');
                      setLevel(l);
                    }}
                    aria-pressed={level.id === l.id}
                    className={`flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[.98] ${
                      level.id === l.id
                        ? 'border-(--accent) bg-(--accent-soft)'
                        : 'border-transparent bg-(--card) shadow-sm'
                    }`}
                  >
                    <span className="text-lg font-bold">{l.name}</span>
                    <span className="text-sm text-(--muted)">
                      {l.options} opciones · {l.seconds} s
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={start} className="btn-primary">
                ¡Arrancar!
              </button>
            </>
          )}

          {q && (
            <>
              <h2 className="text-lg leading-snug font-bold md:text-3xl">
                ¿Cuál es la capital de <span className="text-(--accent)">{q.province}</span>?
              </h2>
              <div className="h-2.5 overflow-hidden rounded-full bg-(--card)">
                <div
                  key={index}
                  className="timer h-full rounded-full bg-(--sun)"
                  style={{
                    animationDuration: `${level.seconds}s`,
                    animationPlayState: answered ? 'paused' : 'running',
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                {q.options.map((option) => {
                  const state = !answered
                    ? 'bg-(--card) shadow-sm hover:bg-(--accent-soft)'
                    : option === q.capital
                      ? 'bg-(--ok) text-white'
                      : option === picked
                        ? 'bg-(--bad) text-white'
                        : 'bg-(--card) opacity-50';
                  return (
                    <button
                      key={option}
                      onClick={() => answer(option)}
                      disabled={answered}
                      className={`min-h-11 rounded-2xl px-4 py-2 text-left text-base font-semibold transition active:scale-[.98] md:text-lg ${state}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <div className={`flex min-h-12 items-center gap-3 ${answered ? '' : 'invisible'}`}>
                <p className="flex-1 text-lg leading-tight font-bold md:text-xl" aria-live="polite">
                  {answered && message}
                </p>
                {answered && (
                  <button onClick={next} autoFocus className="btn-primary">
                    {index + 1 < questions.length ? 'Siguiente' : 'Ver resultado'}
                  </button>
                )}
              </div>
            </>
          )}

        </section>
      </div>

      {over && (
        <div className="fixed inset-0 z-10 flex flex-col justify-end bg-[#0f1c2b] bg-[url(/final.jpg)] bg-cover bg-center">
          <div className="bg-linear-to-t from-[#0f1c2b] via-[#0f1c2b]/85 to-transparent px-6 pt-32 pb-10 text-center text-white">
            <div className="mx-auto flex max-w-md flex-col gap-4 [text-shadow:0_2px_12px_rgb(0_0_0/0.6)]">
              <h2 className="text-3xl font-extrabold md:text-4xl">¡Terminaste!</h2>
              <p className="text-7xl font-extrabold">
                {score}
                <span className="text-4xl text-white/60">/{results.length}</span>
              </p>
              <p className="text-lg">en {Math.round(elapsed / 1000)} segundos</p>
              <button onClick={start} className="btn-primary">
                Jugar de nuevo
              </button>
              <button onClick={quit} className="text-sm text-white/70 underline underline-offset-4">
                Cambiar dificultad
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
