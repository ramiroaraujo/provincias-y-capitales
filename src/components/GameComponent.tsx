'use client';

import React, { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { machine, timeLimit } from '@/lib/game';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function GameComponent() {
  const [state, send] = useMachine(machine);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.matches({ playing: 'question' }) && state.context.questionStartTime) {
      const updateProgress = () => {
        const elapsedTime = Date.now() - state.context.questionStartTime!;
        const totalTime = timeLimit[state.context.difficulty as 1 | 2 | 3];
        const newProgress = Math.max(0, 100 - (elapsedTime / totalTime) * 100);
        setProgress(newProgress);
      };

      intervalId = setInterval(updateProgress, 50);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.context.questionStartTime, state.context.difficulty, state.value]);

  const handleStart = () => {
    send({ type: 'SELECT', difficulty: selectedDifficulty });
  };

  const handleAnswer = (index: number) => {
    send({ type: 'ANSWER', index });
  };

  const handleNext = () => {
    send({ type: 'NEXT' });
  };

  const handleRestart = () => {
    send({ type: 'RESTART' });
  };

  return (
    <div className="flex flex-col w-full max-w-sm md:max-w-md mx-auto px-4 py-6 h-full">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Provincias y Capitales</h1>
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex-grow flex flex-col items-center justify-center">
          {state.matches('difficultySelection') && (
            <div className="flex flex-col items-center w-full">
              <h2 className="text-lg md:text-xl mb-4 text-center">Elegí la dificultad</h2>
              <div className="flex gap-2 mb-4 w-full">
                {[1, 2, 3].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    variant={selectedDifficulty === level ? 'default' : 'outline'}
                    className="flex-1 h-12 active:scale-95 transition-transform"
                  >
                    {level}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleStart}
                className="w-full h-12 active:scale-95 transition-transform"
              >
                Arrancar el juego
              </Button>
            </div>
          )}
          {state.matches('playing') && state.context.currentQuestion && (
            <div className="flex flex-col items-center w-full">
              <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
                ¿Cuál es la capital de {state.context.currentQuestion.question}?
              </h2>
              {state.matches({ playing: 'question' }) && (
                <>
                  <Progress value={progress} className="w-full mb-4" />
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {state.context.currentQuestion.answers.map((answer, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full h-12 active:scale-95 transition-transform"
                      >
                        {answer.name}
                      </Button>
                    ))}
                  </div>
                </>
              )}
              {state.matches({ playing: 'result' }) && (
                <div
                  className="flex flex-col items-center w-full cursor-pointer"
                  onClick={handleNext}
                >
                  {state.context.lastResult ? (
                    <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-green-500 mb-2" />
                  ) : (
                    <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 mb-2" />
                  )}
                  <p className="text-xl md:text-2xl mb-1">
                    {state.context.lastResult ? '¡Bien ahí!' : '¡Uh, le erraste!'}
                  </p>
                  {!state.context.lastResult && (
                    <p className="text-base md:text-lg mb-2">La correcta es:</p>
                  )}
                  <p className="text-2xl md:text-3xl font-bold mb-4 text-center">
                    {state.context.currentQuestion.answers.find((a) => a.correct)?.name}
                  </p>
                  <p className="text-sm md:text-base text-gray-500">Tocá para continuar</p>
                </div>
              )}
            </div>
          )}
          {state.matches('gameOver') && (
            <div className="flex flex-col items-center w-full">
              <h2 className="text-xl mb-4 text-center">¡Se terminó el juego!</h2>
              <p className="text-lg mb-4 text-center">
                Tu puntaje: {state.context.score} / {state.context.questions.length}
              </p>
              <p className="text-lg mb-4 text-center">
                Tiempo total: {(state.context.timeTaken / 1000).toFixed(2)} segundos
              </p>
              <Button
                onClick={handleRestart}
                className="w-full h-12 active:scale-95 transition-transform"
              >
                Jugar de nuevo
              </Button>
            </div>
          )}
        </div>
        {state.matches('playing') && (
          <div className="w-full mt-4">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="w-full h-12 active:scale-95 transition-transform bg-gray-700 text-white hover:bg-gray-600"
            >
              Reiniciar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
