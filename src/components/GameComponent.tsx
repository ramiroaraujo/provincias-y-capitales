'use client';

import { useState } from 'react';
import { useMachine } from '@xstate/react';
import { Button } from '@/components/ui/button';
import { machine } from '@/lib/game';

export default function GameComponent() {
  const [state, send] = useMachine(machine);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);

  const handleStart = () => {
    send({ type: 'SELECT', difficulty: selectedDifficulty });
  };

  const handleAnswer = (index: number) => {
    send({ type: 'ANSWER', index });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      {state.matches('difficultySelection') && (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl mb-4 text-center">Elegí la dificultad</h2>
          <div className="flex gap-2 mb-4 w-full">
            {[1, 2, 3].map((level) => (
              <Button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                variant={selectedDifficulty === level ? 'default' : 'outline'}
                className="flex-1"
              >
                {level}
              </Button>
            ))}
          </div>
          <Button onClick={handleStart} className="w-full">
            Arrancar el juego
          </Button>
        </div>
      )}
      {state.matches('playing') && state.context.currentQuestion && (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-lg mb-4 text-center">
            ¿Cuál es la capital de {state.context.currentQuestion.question}?
          </h2>
          <div className="grid grid-cols-1 gap-2 w-full">
            {state.context.currentQuestion.answers.map((answer, index) => (
              <Button key={index} onClick={() => handleAnswer(index)} className="w-full">
                {answer.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      {state.matches({ playing: 'result' }) && (
        <div className="text-xl mb-4 text-center">
          {state.context.lastResult ? '¡Bien ahí!' : '¡Uh, le erraste!'}
        </div>
      )}
      {state.matches('gameOver') && (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-xl mb-4 text-center">¡Se terminó el juego!</h2>
          <p className="text-lg mb-4 text-center">
            Tu puntaje: {state.context.score} / {state.context.questions.length}
          </p>
          <Button onClick={() => send({ type: 'RESTART' })} className="w-full">
            Jugar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
