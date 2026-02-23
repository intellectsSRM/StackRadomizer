import { GeneratedStack } from '@/lib/stacks';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const categoryStyles = {
  frontend: { label: 'Frontend', glowClass: 'neon-border' },
  backend: { label: 'Backend', glowClass: 'cyan-border' },
  database: { label: 'Database', glowClass: 'purple-border' },
};

interface StackCardProps {
  stack: GeneratedStack;
  teamLabel?: string;
  index?: number;
}

export default function StackCard({ stack, teamLabel, index = 0 }: StackCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `${teamLabel ? teamLabel + '\n' : ''}Frontend: ${stack.frontend.icon} ${stack.frontend.name}\nBackend: ${stack.backend.icon} ${stack.backend.name}\nDatabase: ${stack.database.icon} ${stack.database.name}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entries = [
    { key: 'frontend' as const, item: stack.frontend },
    { key: 'backend' as const, item: stack.backend },
    { key: 'database' as const, item: stack.database },
  ];

  return (
    <div
      className="animate-card-appear relative rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">
          {teamLabel || 'Your Stack'}
        </h3>
        <button
          onClick={copyToClipboard}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
          title="Copy stack"
        >
          {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
        </button>
      </div>

      <div className="space-y-3">
        {entries.map(({ key, item }) => {
          const style = categoryStyles[key];
          return (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-md border bg-background/50 px-3 py-2 ${style.glowClass}`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {style.label}
                </div>
                <div className="font-mono text-sm font-semibold text-foreground">{item.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
