import GameComponent from '@/components/GameComponent';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Provincias y Capitales</h1>
      <GameComponent />
    </main>
  );
}
