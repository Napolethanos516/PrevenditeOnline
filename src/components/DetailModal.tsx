import { useEffect } from "react";
import { X, Calendar, MapPin, Ticket } from "lucide-react";
import type { Poster } from "@/types";
import RequestForm from "./RequestForm";
import { formatEventDateLabel, getAvailabilityLabel } from "@/lib/poster-utils";

type Props = {
  poster: Poster | null;
  onClose: () => void;
  onOpenPrivacy?: () => void;
  onTrackView?: (params: { view_type: "poster"; poster_id: string }) => void;
};

export default function DetailModal({ poster, onClose, onOpenPrivacy, onTrackView }: Props) {
  useEffect(() => {
    if (poster) {
      document.body.style.overflow = "hidden";
      onTrackView?.({ view_type: "poster", poster_id: poster.id });
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [poster, onClose, onTrackView]);

  if (!poster) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-ink-700 bg-ink-950 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="poster-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-ink-950/80 p-2 text-ink-300 backdrop-blur-sm transition-colors hover:bg-ink-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
          aria-label="Chiudi dettagli evento"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={poster.image_url}
            alt={poster.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
          {poster.sold_out && (
            <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-1.5 shadow-lg">
              <span className="text-sm font-bold text-white uppercase tracking-wide">SOLD OUT</span>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 rounded-full bg-ink-800 w-fit px-3 py-1 mb-4">
            <Calendar className="h-3 w-3 text-neon" />
            <span className="text-xs font-medium text-ink-200">{poster.category}</span>
          </div>

          <h2 id="poster-modal-title" className="font-sans text-2xl sm:text-3xl text-white mb-3">
            {poster.title}
          </h2>
          <div className="mb-5 grid grid-cols-1 gap-2 rounded-xl border border-ink-800 bg-ink-900/70 p-4 text-xs text-ink-200 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neon" />
              <span>{formatEventDateLabel(poster.event_date)}</span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neon" />
              <span>Roma</span>
            </p>
            <p className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-neon" />
              <span>Prezzo su richiesta</span>
            </p>
            <p className="flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${poster.sold_out ? "bg-red-600 text-white" : "bg-emerald-500/20 text-emerald-300"}`}>
                {getAvailabilityLabel(poster.sold_out)}
              </span>
            </p>
          </div>
          <p className="text-sm leading-relaxed text-ink-300 mb-6">
            {poster.full_description}
          </p>

          <div className="border-t border-ink-800 pt-6">
            <h3 className="font-sans text-lg text-ink-100 mb-4">
              Richiesta rapida
            </h3>
            <RequestForm poster={poster} variant="modal" onOpenPrivacy={onOpenPrivacy} />
          </div>
        </div>
      </div>
    </div>
  );
}
