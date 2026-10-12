import { useEffect } from "react";
import { X, Shield } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PrivacyPolicyModal({ open, onClose }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-ink-700 bg-ink-950 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-800 bg-ink-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-neon" />
            <h2 className="font-display text-xl text-white">Privacy Policy</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-ink-950/80 p-2 text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5 text-sm leading-relaxed text-ink-300">
          <div>
            <h3 className="font-display text-base font-semibold text-ink-100 mb-2">
              INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI (Art. 13 GDPR)
            </h3>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-ink-100">1. Titolare del Trattamento:</h4>
            <p>
              I dati raccolti tramite questo sito (numero di telefono o username Instagram) sono
              trattati dall'organizzazione dell'evento esclusivamente per la gestione delle
              richieste di contatto e l'organizzazione della consegna delle prevendite di persona.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-ink-100">2. Finalità e Base Giuridica del Trattamento:</h4>
            <p>
              I dati vengono forniti volontariamente dall'utente per essere ricontattato in merito
              alle informazioni sugli eventi e alla prenotazione/acquisto delle prevendite. Il
              consenso è prestato ai sensi dell'Art. 6 par. 1 lett. a del GDPR e dell'Art.
              2-quinquies del D.Lgs. 196/2003 (consenso per minori di almeno 14 anni).
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-ink-100">3. Età Minima:</h4>
            <p>
              L'utilizzo del servizio di contatto è riservato esclusivamente a utenti che abbiano
              compiuto almeno 14 anni.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-ink-100">4. Modalità e Conservazione dei Dati:</h4>
            <p>
              I contatti non verranno ceduti a terzi né utilizzati per invio di materiale
              pubblicitario massivo (spam). I dati raccolti saranno conservati unicamente per il
              tempo strettamente necessario a completare la richiesta di contatto e la consegna
              della prevendita, dopodiché verranno cancellati.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-ink-100">5. Diritti dell'Interessato:</h4>
            <p>
              L'utente può richiedere in qualsiasi momento la cancellazione o la modifica dei
              propri dati inviando una semplice richiesta al canale con cui è stato ricontattato
              (WhatsApp/Instagram).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
