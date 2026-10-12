import { useState } from "react";
import { User, Phone, Instagram, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatContact } from "@/lib/contact-utils";

export default function PromoterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasExperience, setHasExperience] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !instagram.trim()) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }
    if (hasExperience === null) {
      setError("Indica se hai gia lavorato come promoter.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const formattedIg = formatContact(instagram.trim(), "instagram");

      const { error: insertError } = await supabase.from("promoter_applications").insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        has_experience: hasExperience,
        phone: phone.trim(),
        instagram: formattedIg,
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
          notification_type: "promoter_application",
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          has_experience: hasExperience,
          phone: phone.trim(),
          instagram: formattedIg,
        }),
      }).catch(() => {});

      setSuccess(true);
      setFirstName("");
      setLastName("");
      setHasExperience(null);
      setPhone("");
      setInstagram("");
    } catch {
      setError("Errore durante l'invio. Riprova tra un momento.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-neon/30 bg-neon/5 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-neon" />
        <p className="text-sm font-medium text-ink-100">
          Candidatura inviata con successo! Ti contatteremo a breve.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 rounded text-xs text-ink-400 underline transition-colors hover:text-ink-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
        >
          Invia un'altra candidatura
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Nome</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nome"
              className="w-full rounded-lg border border-ink-700 bg-ink-950 py-3 pl-10 pr-3 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon focus-visible:ring-2"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Cognome</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Cognome"
              className="w-full rounded-lg border border-ink-700 bg-ink-950 py-3 pl-10 pr-3 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon focus-visible:ring-2"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-300">
          Hai gia lavorato come promoter?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setHasExperience(true); setError(""); }}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
              hasExperience === true
                ? "border-neon bg-neon text-ink-950"
                : "border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500"
            }`}
          >
            Si
          </button>
          <button
            type="button"
            onClick={() => { setHasExperience(false); setError(""); }}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
              hasExperience === false
                ? "border-ink-100 bg-ink-100 text-ink-950"
                : "border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-300">Numero di telefono</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+39 ..."
            className="w-full rounded-lg border border-ink-700 bg-ink-950 py-3 pl-10 pr-3 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon focus-visible:ring-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-300">Instagram</label>
        <div className="relative">
          <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@account"
            className="w-full rounded-lg border border-ink-700 bg-ink-950 py-3 pl-10 pr-3 text-sm text-ink-100 placeholder:text-ink-500 transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon focus-visible:ring-2"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400 animate-fade-in" role="alert">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink-100 px-4 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Invio in corso..." : "Invia Candidatura"}
      </button>
    </form>
  );
}
