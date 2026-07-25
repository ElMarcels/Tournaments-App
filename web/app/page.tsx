import Button from '@/components/Button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-purple-500 mb-4">TournamentHub</h1>
      <p className="text-gray-400 text-lg mb-8">
        Global platform for managing esports tournaments.
      </p>
      <div className="flex gap-4">
        <Button variant="primary">Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  );
}
