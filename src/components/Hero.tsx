import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute left-[18%] top-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[100px]" />
        <div className="absolute right-[12%] top-16 h-56 w-56 rounded-full bg-amber-300/10 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900 px-4 py-1.5 text-xs font-medium text-ink-300 mb-6 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-neon animate-pulse" />
          Online 24/7 · Acquisto di persona
        </span>
        <h1 className="font-sans text-4xl leading-tight text-white sm:text-6xl md:text-7xl animate-slide-up">
          Prevendite eventi
          <br />
          <span className="text-cyan-300">chiare e veloci a Roma</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-400 sm:text-lg animate-slide-up">
          Scopri subito disponibilità, data e dettagli delle serate Loco, poi invia la richiesta in pochi secondi.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-slide-up">
          <a
            href="#locandine"
            className="inline-flex items-center gap-2 rounded-lg bg-ink-100 px-6 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
          >
            Scopri gli eventi
            <ArrowDown className="h-4 w-4" />
          </a>
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-6 py-3 text-sm font-semibold text-ink-100 transition-all hover:border-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
          >
            Contattaci subito
          </a>
        </div>
      </div>
    </section>
  );
}
