import { Search } from "lucide-react";

type Props = {
  search: string;
  onSearch: (val: string) => void;
};

export default function Header({ search, onSearch }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/2BAE7646-B4B9-4F8D-B324-8BBBBA98F69D.png"
            alt="PrevenditeOnline"
            className="h-11 w-11 rounded-lg object-cover"
          />
          <span className="font-sans text-xl text-white hidden sm:block">PrevenditeOnline</span>
        </a>

        <div className="relative order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Cerca locandine..."
            className="w-full rounded-lg border border-ink-700 bg-ink-900 py-2.5 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon focus-visible:ring-2 focus-visible:ring-neon"
          />
        </div>

        <nav className="ml-auto flex items-center gap-3 sm:gap-6">
          <a href="#locandine" className="text-sm font-medium text-ink-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon rounded">
            Eventi
          </a>
          <a href="#contatti" className="hidden text-sm font-medium text-ink-300 transition-colors hover:text-white sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon rounded">
            Contatti
          </a>
          <a
            href="#locandine"
            className="inline-flex items-center rounded-lg bg-neon px-3 py-2 text-xs font-bold text-ink-950 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-dark sm:text-sm"
          >
            Prenota ora
          </a>
        </nav>
      </div>
    </header>
  );
}
