import GameComponent from '@/components/GameComponent';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
        Provincias y Capitales
      </h1>
      <GameComponent />
    </main>
  );
}
