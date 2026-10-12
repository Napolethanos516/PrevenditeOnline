import { Calendar, MapPin, Star, Ticket } from "lucide-react";
import type { Poster } from "@/types";
import { formatEventDateLabel, getAvailabilityLabel } from "@/lib/poster-utils";

type Props = {
  poster: Poster;
  onClick: () => void;
};

export default function PosterCard({ poster, onClick }: Props) {
  const availabilityLabel = getAvailabilityLabel(poster.sold_out);

  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-ink-900 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon animate-slide-up ${
        poster.is_featured
          ? "border-cyan-400/60 ring-1 ring-cyan-400/30 hover:border-cyan-400"
          : "border-ink-800 hover:border-ink-600"
      }`}
    >
      {poster.is_featured && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-cyan-400 px-2.5 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 text-ink-950 fill-ink-950" />
          <span className="text-xs font-bold text-ink-950">In evidenza</span>
        </div>
      )}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={poster.image_url}
          alt={poster.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink-950/80 px-3 py-1 backdrop-blur-sm">
          <Calendar className="h-3 w-3 text-cyan-300" />
          <span className="text-xs font-medium text-ink-200">{poster.category}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${poster.sold_out ? "bg-red-600 text-white" : "bg-emerald-500/20 text-emerald-300"}`}>
            {availabilityLabel}
          </span>
          <span className="rounded-full border border-ink-700 bg-ink-950 px-2.5 py-1 text-[11px] font-medium text-ink-200">
            Prezzo su richiesta
          </span>
        </div>
        <h3 className="font-sans text-lg leading-tight text-ink-50 group-hover:text-white transition-colors">
          {poster.title}
        </h3>
        <div className="mt-2 space-y-1.5 text-xs text-ink-300">
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-cyan-300" />
            <span>{formatEventDateLabel(poster.event_date)}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-cyan-300" />
            <span>Roma</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-cyan-300" />
            <span>Acquisto in persona</span>
          </p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-400">
          {poster.short_description}
        </p>
        <span className="mt-3 text-xs font-medium text-cyan-300 opacity-90 transition-opacity group-hover:opacity-100">
          Vedi dettagli →
        </span>
      </div>
    </button>
  );
}
