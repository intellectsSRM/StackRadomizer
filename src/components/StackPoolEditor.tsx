import { useState } from 'react';
import { TechCategory } from '@/lib/stacks';
import { Plus, X, Settings } from 'lucide-react';

interface StackPoolEditorProps {
  pools: TechCategory[];
  onUpdate: (pools: TechCategory[]) => void;
}

export default function StackPoolEditor({ pools, onUpdate }: StackPoolEditorProps) {
  const [open, setOpen] = useState(false);
  const [newItems, setNewItems] = useState<Record<string, string>>({});

  const addItem = (categoryKey: string) => {
    const name = newItems[categoryKey]?.trim();
    if (!name) return;
    const updated = pools.map(p =>
      p.key === categoryKey
        ? { ...p, items: [...p.items, { name, icon: '🔧' }] }
        : p
    );
    onUpdate(updated);
    setNewItems(prev => ({ ...prev, [categoryKey]: '' }));
  };

  const removeItem = (categoryKey: string, itemName: string) => {
    const updated = pools.map(p =>
      p.key === categoryKey
        ? { ...p, items: p.items.filter(i => i.name !== itemName) }
        : p
    );
    onUpdate(updated);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Settings size={16} />
        Customize Stack Pools
      </button>
    );
  }

  return (
    <div className="w-full rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Stack Pool Editor</h3>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pools.map(category => (
          <div key={category.key} className="rounded-md border border-border bg-background/50 p-4">
            <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-primary">
              {category.label}
            </h4>
            <div className="mb-3 flex flex-wrap gap-2">
              {category.items.map(item => (
                <span
                  key={item.name}
                  className="group flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-foreground"
                >
                  {item.icon} {item.name}
                  <button
                    onClick={() => removeItem(category.key, item.name)}
                    className="ml-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newItems[category.key] || ''}
                onChange={e => setNewItems(prev => ({ ...prev, [category.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addItem(category.key)}
                placeholder="Add tech..."
                className="flex-1 rounded-md border border-border bg-input px-3 py-1.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => addItem(category.key)}
                className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1.5 text-primary transition-colors hover:bg-primary/20"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
