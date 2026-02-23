export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  label: string;
  key: string;
  color: 'primary' | 'secondary' | 'accent' | 'destructive';
  items: TechItem[];
}

export interface GeneratedStack {
  frontend: TechItem;
  backend: TechItem;
  database: TechItem;
}

export interface TeamStack {
  teamNumber: number;
  stack: GeneratedStack;
}

export const defaultPools: TechCategory[] = [
  {
    label: 'Frontend',
    key: 'frontend',
    color: 'primary',
    items: [
      { name: 'React', icon: '⚛️' },
      { name: 'Angular', icon: '🅰️' },
      { name: 'Vue.js', icon: '💚' },
      { name: 'Svelte', icon: '🔥' },
      { name: 'Next.js', icon: '▲' },
      { name: 'HTML/CSS/JS', icon: '🌐' },
      { name: 'Solid.js', icon: '💎' },
      { name: 'Flutter Web', icon: '🦋' },
    ],
  },
  {
    label: 'Backend',
    key: 'backend',
    color: 'secondary',
    items: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Spring Boot', icon: '🍃' },
      { name: 'Django', icon: '🐍' },
      { name: 'Flask', icon: '🧪' },
      { name: 'Express.js', icon: '⚡' },
      { name: 'FastAPI', icon: '🚀' },
      { name: 'Go (Gin)', icon: '🐹' },
      { name: 'Ruby on Rails', icon: '💎' },
    ],
  },
  {
    label: 'Database',
    key: 'database',
    color: 'accent',
    items: [
      { name: 'MySQL', icon: '🐬' },
      { name: 'MongoDB', icon: '🍃' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Firebase', icon: '🔥' },
      { name: 'Redis', icon: '🔴' },
      { name: 'SQLite', icon: '📦' },
      { name: 'Supabase', icon: '⚡' },
      { name: 'CockroachDB', icon: '🪳' },
    ],
  },
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateStack(pools: TechCategory[]): GeneratedStack {
  const frontend = pools.find(p => p.key === 'frontend')!;
  const backend = pools.find(p => p.key === 'backend')!;
  const database = pools.find(p => p.key === 'database')!;

  return {
    frontend: pickRandom(frontend.items),
    backend: pickRandom(backend.items),
    database: pickRandom(database.items),
  };
}

export function generateUniqueStacks(pools: TechCategory[], count: number): TeamStack[] {
  const stacks: TeamStack[] = [];
  const usedCombos = new Set<string>();
  const maxAttempts = count * 20;
  let attempts = 0;

  while (stacks.length < count && attempts < maxAttempts) {
    const stack = generateStack(pools);
    const key = `${stack.frontend.name}-${stack.backend.name}-${stack.database.name}`;
    if (!usedCombos.has(key)) {
      usedCombos.add(key);
      stacks.push({ teamNumber: stacks.length + 1, stack });
    }
    attempts++;
  }

  // Fill remaining if we ran out of unique combos
  while (stacks.length < count) {
    stacks.push({ teamNumber: stacks.length + 1, stack: generateStack(pools) });
  }

  return stacks;
}

export function stackToString(stack: GeneratedStack): string {
  return `Frontend: ${stack.frontend.name}\nBackend: ${stack.backend.name}\nDatabase: ${stack.database.name}`;
}
