import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, Mail, Phone, Instagram, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getWhatsAppUrl, getInstagramUrl } from "@/lib/contact-utils";
import { trackView } from "@/lib/track-view";
import type { Poster, SiteContacts } from "@/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PosterCard from "@/components/PosterCard";
import DetailModal from "@/components/DetailModal";
import AdminPanel from "@/components/AdminPanel";
import PromoterForm from "@/components/PromoterForm";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import AgeGate from "@/components/AgeGate";

function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export default function App() {
  const hash = useHashRoute();
  const isAdmin = hash === "#/admin" || hash === "#admin";

  if (isAdmin) return <AdminPanel />;
  return <PublicSite />;
}

function PublicSite() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [contacts, setContacts] = useState<SiteContacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Poster | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const loadPosters = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posters")
      .select("*")
      .eq("is_hidden", false)
      .or("publish_at.is.null,publish_at.lte." + new Date().toISOString())
      .order("is_featured", { ascending: false })
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    setPosters(data || []);
    setLoading(false);
  }, []);

  const loadContacts = useCallback(async () => {
    const { data } = await supabase
      .from("site_contacts")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) setContacts(data);
  }, []);

  useEffect(() => {
    loadPosters();
    loadContacts();
  }, [loadPosters, loadContacts]);

  useEffect(() => {
    trackView({ view_type: "site" });
  }, []);

  const filtered = posters.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-ink-950">
      <a href="#contenuto-principale" className="sr-only z-[101] rounded bg-neon px-4 py-2 text-sm font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Salta al contenuto principale
      </a>
      <Header search={search} onSearch={setSearch} />
      <main id="contenuto-principale">
        <Hero />

        <section id="locandine" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-sans text-2xl text-white sm:text-3xl">
                Eventi e prevendite
              </h2>
              <p className="mt-1 text-sm text-ink-400">
                Seleziona un evento per vedere disponibilità, dettagli e richiesta rapida.
              </p>
            </div>
            <span className="text-sm text-ink-300" aria-live="polite">{filtered.length} risultati</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite" aria-label="Caricamento eventi">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-ink-800 bg-ink-900"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchIcon className="mb-4 h-10 w-10 text-ink-600" />
              <p className="text-sm text-ink-300">
                Nessuna locandina trovata per "{search}".
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 rounded-lg border border-ink-700 px-4 py-2 text-xs font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
              >
                Cancella ricerca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((poster) => (
                <PosterCard
                  key={poster.id}
                  poster={poster}
                  onClick={() => setSelected(poster)}
                />
              ))}
            </div>
          )}
        </section>

        <section id="contatti" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-8 sm:p-12 text-center">
          <h2 className="font-sans text-2xl text-white sm:text-3xl mb-3">Contatti</h2>
          <p className="text-sm text-ink-400 mb-8 max-w-md mx-auto">
            Hai domande o vuoi prenotare direttamente? Scrivici o chiamaci.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            {contacts?.email && (
              <a
                href={`mailto:${contacts.email}`}
                className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-950 px-6 py-4 transition-all hover:border-cyan-400/50 hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10">
                  <Mail className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-ink-500">Email</p>
                  <p className="text-sm font-medium text-ink-100">{contacts.email}</p>
                </div>
              </a>
            )}
            {contacts?.phone && (
              <a
                href={getWhatsAppUrl(contacts.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-950 px-6 py-4 transition-all hover:border-cyan-400/50 hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10">
                  <Phone className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-ink-500">Telefono</p>
                  <p className="text-sm font-medium text-ink-100">{contacts.phone}</p>
                </div>
              </a>
            )}
            {contacts?.instagram && (
              <a
                href={getInstagramUrl(contacts.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-950 px-6 py-4 transition-all hover:border-cyan-400/50 hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10">
                  <Instagram className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-ink-500">Instagram</p>
                  <p className="text-sm font-medium text-ink-100">{contacts.instagram}</p>
                </div>
              </a>
            )}
          </div>
        </div>
        </section>

        <section id="lavora-con-noi" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-neon/30 bg-gradient-to-br from-ink-900 to-ink-950 p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neon/10">
              <Briefcase className="h-7 w-7 text-neon" />
            </div>
            <h2 className="font-sans text-2xl text-white sm:text-3xl mb-3">Lavora con noi</h2>
            <p className="text-sm text-ink-400 mb-8 max-w-md mx-auto">
              Vuoi entrare nel nostro team come promoter? Compila il modulo e ti contatteremo.
            </p>
          </div>
          <div className="mx-auto max-w-lg">
            <PromoterForm />
          </div>
        </div>
        </section>
      </main>

      <footer className="border-t border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <img
                src="/2BAE7646-B4B9-4F8D-B324-8BBBBA98F69D.png"
                alt="PrevenditeOnline"
                className="h-9 w-9 rounded-lg object-cover"
              />
              <span className="font-sans text-lg text-white">PrevenditeOnline</span>
            </div>
            <p className="text-xs text-ink-500">
              Eventi Loco a Roma · © 2026
            </p>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-xs text-ink-400 hover:text-ink-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon rounded"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      <DetailModal poster={selected} onClose={() => setSelected(null)} onOpenPrivacy={() => setPrivacyOpen(true)} onTrackView={trackView} />
      <PrivacyPolicyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <AgeGate onOpenPrivacy={() => setPrivacyOpen(true)} />
    </div>
  );
}
