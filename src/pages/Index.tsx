import { useState, useCallback } from 'react';
import { defaultPools, generateStack, generateUniqueStacks, TechCategory, GeneratedStack, TeamStack } from '@/lib/stacks';
import StackCard from '@/components/StackCard';
import StackPoolEditor from '@/components/StackPoolEditor';
import { Dices, Users, RotateCcw, Download } from 'lucide-react';

export default function Index() {
  const [pools, setPools] = useState<TechCategory[]>(defaultPools);
  const [singleStack, setSingleStack] = useState<GeneratedStack | null>(null);
  const [teamStacks, setTeamStacks] = useState<TeamStack[]>([]);
  const [teamCount, setTeamCount] = useState(4);
  const [mode, setMode] = useState<'single' | 'team'>('single');
  const [isSpinning, setIsSpinning] = useState(false);

  const generate = useCallback(() => {
    setIsSpinning(true);
    setTeamStacks([]);
    setSingleStack(null);

    setTimeout(() => {
      if (mode === 'single') {
        setSingleStack(generateStack(pools));
      } else {
        setTeamStacks(generateUniqueStacks(pools, teamCount));
      }
      setIsSpinning(false);
    }, 600);
  }, [mode, pools, teamCount]);

  const reset = () => {
    setSingleStack(null);
    setTeamStacks([]);
  };

  const downloadPDF = () => {
    const stacks = mode === 'single' && singleStack
      ? [{ teamNumber: 0, stack: singleStack }]
      : teamStacks;

    let text = '🎲 HACKATHON STACK ASSIGNMENTS\n' + '='.repeat(40) + '\n\n';
    stacks.forEach(ts => {
      const label = ts.teamNumber === 0 ? 'Your Stack' : `Team ${ts.teamNumber}`;
      text += `${label}\n`;
      text += `  Frontend: ${ts.stack.frontend.icon} ${ts.stack.frontend.name}\n`;
      text += `  Backend:  ${ts.stack.backend.icon} ${ts.stack.backend.name}\n`;
      text += `  Database: ${ts.stack.database.icon} ${ts.stack.database.name}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hackathon-stacks.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasResults = singleStack || teamStacks.length > 0;

  return (
    <div className="grid-bg scanline relative min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <h1 className="neon-text font-display text-xl font-bold text-primary sm:text-2xl">
              StackShuffle
            </h1>
          </div>
          <span className="hidden font-mono text-xs text-muted-foreground sm:block">
            hackathon stack randomizer
          </span>
        </div>
      </header>

      <main className="container py-8 sm:py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-display text-3xl font-extrabold text-foreground sm:text-5xl">
            Randomize Your <span className="neon-text text-primary">Tech Stack</span>
          </h2>
          <p className="mx-auto max-w-lg font-mono text-sm text-muted-foreground">
            Generate unique tech stack combos for hackathon teams. No excuses — build with what you get.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mx-auto mb-6 flex max-w-xs overflow-hidden rounded-lg border border-border bg-card">
          <button
            onClick={() => { setMode('single'); reset(); }}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 font-mono text-sm transition-colors ${
              mode === 'single' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Dices size={16} /> Single
          </button>
          <button
            onClick={() => { setMode('team'); reset(); }}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 font-mono text-sm transition-colors ${
              mode === 'team' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users size={16} /> Teams
          </button>
        </div>

        {/* Team Count */}
        {mode === 'team' && (
          <div className="mx-auto mb-6 flex max-w-xs items-center justify-center gap-3">
            <label className="font-mono text-sm text-muted-foreground">Teams:</label>
            <input
              type="number"
              min={2}
              max={20}
              value={teamCount}
              onChange={e => setTeamCount(Math.max(2, Math.min(20, Number(e.target.value))))}
              className="w-20 rounded-md border border-border bg-input px-3 py-1.5 text-center font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Generate Button */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={generate}
            disabled={isSpinning}
            className={`neon-border group relative rounded-lg border bg-primary/10 px-8 py-4 font-display text-lg font-bold text-primary transition-all hover:bg-primary/20 ${
              isSpinning ? 'animate-neon-pulse' : 'hover:neon-border-strong'
            }`}
          >
            <span className={isSpinning ? 'animate-pulse' : ''}>
              {isSpinning ? '⚡ Shuffling...' : '🎲 Generate Stack'}
            </span>
          </button>

          {hasResults && (
            <>
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw size={16} /> Reset
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Download size={16} /> Export
              </button>
            </>
          )}
        </div>

        {/* Results */}
        {singleStack && (
          <div className="mx-auto max-w-sm">
            <StackCard stack={singleStack} />
          </div>
        )}

        {teamStacks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamStacks.map(ts => (
              <StackCard
                key={ts.teamNumber}
                stack={ts.stack}
                teamLabel={`Team ${ts.teamNumber}`}
                index={ts.teamNumber - 1}
              />
            ))}
          </div>
        )}

        {/* Pool Editor */}
        <div className="mt-12">
          <StackPoolEditor pools={pools} onUpdate={setPools} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center font-mono text-xs text-muted-foreground">
        Built for hackers, by hackers 🚀
      </footer>
    </div>
  );
}
