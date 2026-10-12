import { useState } from "react";
import { MessageCircle, Handshake, Phone, Instagram, Send, CheckCircle2, UserSearch, Ban, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { detectContactType, formatContact, isValidInstagram } from "@/lib/contact-utils";
import { formatEventDateLabel, getAvailabilityLabel } from "@/lib/poster-utils";
import type { ContactType, RequestType, Poster } from "@/types";

type Props = {
  poster: Poster;
  variant?: "card" | "modal";
  onOpenPrivacy?: () => void;
};

export default function RequestForm({ poster, variant = "card", onOpenPrivacy }: Props) {
  const [requestType, setRequestType] = useState<RequestType>("info");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<ContactType | null>(null);
  const [referrer, setReferrer] = useState("");
  const [referrerValid, setReferrerValid] = useState<boolean | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedContact, setSubmittedContact] = useState("");

  const handleChange = (val: string) => {
    setContact(val);
    setError("");
    setContactType(detectContactType(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = contact.trim();
    const trimmedReferrer = referrer.trim();
    if (!trimmed) {
      setError("Inserisci un contatto per permetterci di raggiungerti.");
      return;
    }
    const detected = detectContactType(trimmed);
    if (!detected) {
      setError("Contatto non valido. Inserisci un numero di telefono o un username Instagram valido.");
      return;
    }
    if (!trimmedReferrer) {
      setError("Indica l'account Instagram da cui hai reperito il link.");
      return;
    }
    if (!isValidInstagram(trimmedReferrer)) {
      setError("Il campo \"Da chi sei stato mandato?\" deve essere un username Instagram valido (es. @account).");
      return;
    }
    if (!ageConfirmed || !privacyConfirmed) {
      setError("Devi confermare di avere almeno 14 anni e accettare la Privacy Policy per proseguire.");
      return;
    }
    const formatted = formatContact(trimmed, detected);
    const formattedReferrer = formatContact(trimmedReferrer, "instagram");

    setSubmitting(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("requests").insert({
        poster_id: poster.id,
        poster_title: poster.title,
        request_type: requestType,
        contact_type: detected,
        contact_value: formatted,
        referrer: formattedReferrer,
        status: "pending",
      });

      if (insertError) throw insertError;

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-request-notification`;
      fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          poster_title: poster.title,
          request_type: requestType,
          contact_type: detected,
          contact_value: formatted,
          referrer: formattedReferrer,
        }),
      }).catch(() => {});

      setSuccess(true);
      setSubmittedContact(formatted);
      setContact("");
      setContactType(null);
      setReferrer("");
      setAgeConfirmed(false);
      setPrivacyConfirmed(false);
    } catch {
      setError("Errore durante l'invio. Riprova tra un momento.");
    } finally {
      setSubmitting(false);
    }
  };

  if (poster.sold_out) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-600/40 bg-red-950/20 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
          <Ban className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm font-bold text-red-400 uppercase tracking-wide">SOLD OUT</p>
        <p className="text-sm text-ink-300 max-w-xs">
          I biglietti per questo evento sono esauriti. Non e piu possibile inviare richieste.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-neon/30 bg-neon/5 p-6 text-center ${
          variant === "modal" ? "py-8" : "py-6"
        }`}
      >
        <CheckCircle2 className="h-10 w-10 text-neon" />
        <p className="text-sm font-medium text-ink-100">
          Richiesta inviata con successo! Ti contatteremo a breve per completare l'acquisto di persona.
        </p>
        <p className="text-xs text-ink-300">
          {poster.title} · {submittedContact || "Contatto ricevuto"}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 rounded text-xs text-ink-400 underline transition-colors hover:text-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
        >
          Invia un'altra richiesta
        </button>
      </div>
    );
  }

  const availabilityLabel = getAvailabilityLabel(poster.sold_out);
  const submitLabel = requestType === "purchase" ? "Invia richiesta di prenotazione" : "Invia richiesta informazioni";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-ink-700 bg-ink-900 p-4">
        <h4 className="text-sm font-semibold text-white">Riepilogo prevendita</h4>
        <dl className="mt-2 space-y-1 text-xs text-ink-300">
          <div className="flex justify-between gap-3">
            <dt>Evento</dt>
            <dd className="text-right text-ink-100">{poster.title}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Data</dt>
            <dd>{formatEventDateLabel(poster.event_date)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Luogo</dt>
            <dd>Roma</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Prezzo</dt>
            <dd>Su richiesta</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Disponibilità</dt>
            <dd className={poster.sold_out ? "text-red-400" : "text-emerald-400"}>{availabilityLabel}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setRequestType("info")}
          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
            requestType === "info"
              ? "border-ink-100 bg-ink-100 text-ink-950"
              : "border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          Chiedi informazioni
        </button>
        <button
          type="button"
          onClick={() => setRequestType("purchase")}
          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
            requestType === "purchase"
              ? "border-neon bg-neon text-ink-950"
              : "border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500"
          }`}
        >
          <Handshake className="h-4 w-4" />
          Prenota per acquisto di persona
        </button>
      </div>

      <div className="space-y-2 rounded-xl border border-ink-700 bg-ink-900 p-4">
        <label htmlFor="request-referrer" className="flex items-center gap-1.5 text-sm font-medium text-ink-100">
          <UserSearch className="h-4 w-4 text-neon" />
          Da chi sei stato mandato?
        </label>
        <p className="text-xs text-ink-400">
          Indica l'account Instagram da cui hai reperito il link (obbligatorio).
        </p>
        <div className="relative">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${referrerValid === false ? "text-red-400" : "text-ink-500"}`}>
            <Instagram className="h-4 w-4 text-neon" />
          </span>
          <input
            id="request-referrer"
            type="text"
            value={referrer}
            onChange={(e) => {
              const val = e.target.value;
              setReferrer(val);
              setReferrerValid(val.trim() ? isValidInstagram(val) : null);
              setError("");
            }}
            placeholder="@account_instagram"
            aria-invalid={referrerValid === false}
            className={`w-full rounded-lg border bg-ink-950 py-3 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:outline-none focus:ring-1 focus-visible:ring-2 ${
              referrerValid === false
                ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
                : referrerValid === true
                ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500"
                : "border-ink-700 focus:border-neon focus:ring-neon"
            }`}
          />
        </div>
        {referrerValid === false && (
          <p className="text-xs text-red-400">Username Instagram non valido. Deve contenere solo lettere, numeri, punti o trattini bassi.</p>
        )}
        {referrerValid === true && (
          <p className="text-xs text-emerald-400">Rilevato: Instagram</p>
        )}
      </div>

      <div className="relative">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">
            {contactType === "phone" ? (
              <Phone className="h-4 w-4 text-neon" />
            ) : contactType === "instagram" ? (
              <Instagram className="h-4 w-4 text-neon" />
            ) : (
              <span className="text-xs font-medium text-ink-500">?</span>
            )}
          </span>
          <input
            id="request-contact"
            type="text"
            value={contact}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Telefono o Instagram..."
            aria-invalid={contact !== "" && contactType === null}
            className={`w-full rounded-lg border bg-ink-950 py-3 pl-10 pr-4 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:outline-none focus:ring-1 focus-visible:ring-2 ${
              contact && contactType === null
                ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
                : contactType
                ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500"
                : "border-ink-700 focus:border-neon focus:ring-neon"
            }`}
          />
        </div>
        {contact && contactType === null && (
          <p className="mt-1.5 text-xs text-red-400">
            Contatto non riconosciuto. Inserisci un numero di telefono o un username Instagram.
          </p>
        )}
        {contactType && (
          <p className="mt-1.5 text-xs text-emerald-400">
            {contactType === "phone"
              ? "Rilevato: Telefono / WhatsApp"
              : "Rilevato: Instagram"}
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-ink-700 bg-ink-900 p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={ageConfirmed}
            onChange={(e) => { setAgeConfirmed(e.target.checked); setError(""); }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-600 bg-ink-950 text-neon focus:ring-neon focus:ring-offset-ink-900"
          />
          <span className="text-xs leading-relaxed text-ink-200">
            Dichiaro di avere almeno 14 anni.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={privacyConfirmed}
            onChange={(e) => { setPrivacyConfirmed(e.target.checked); setError(""); }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-600 bg-ink-950 text-neon focus:ring-neon focus:ring-offset-ink-900"
          />
          <span className="text-xs leading-relaxed text-ink-200">
            Ho letto la{" "}
            {onOpenPrivacy ? (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="inline-flex items-center gap-0.5 rounded text-neon underline transition-colors hover:text-neon-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
              >
                <Shield className="inline h-3 w-3" />
                Privacy Policy
              </button>
            ) : (
              <a href="#privacy" className="rounded text-neon underline transition-colors hover:text-neon-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon">Privacy Policy</a>
            )}
            {" "}e acconsento ad essere ricontattato via WhatsApp o Instagram solo ed esclusivamente per ricevere informazioni e concordare l'acquisto delle prevendite per gli eventi.
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 px-4 py-2.5">
        <p className="text-center text-xs leading-relaxed text-amber-300">
          Ingresso agli eventi consentito dai 14 anni in su. Somministrazione di alcolici tassativamente vietata ai minori di 18 anni.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-400 animate-fade-in" role="alert">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !ageConfirmed || !privacyConfirmed}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink-100 px-4 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Invio in corso..." : submitLabel}
      </button>
    </form>
  );
}
