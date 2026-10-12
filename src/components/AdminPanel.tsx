import { useState, useEffect, useCallback } from "react";
import { Lock, Plus, Image as ImageIcon, Trash2, Pencil, X, Mail, Phone, Instagram, ExternalLink, Star, Calendar, Users, Briefcase, X as XIcon, TrendingUp, Clock, EyeOff, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getContactActionUrl, getWhatsAppUrl, getInstagramUrl } from "@/lib/contact-utils";
import type { Poster, CustomerRequest, SiteContacts, PromoterApplication, PromoterStatus, SaleStatus } from "@/types";

const ADMIN_PASSWORD = "zonalocofoundation123!";

type AdminTab = "posters" | "requests" | "promoters" | "contacts";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<AdminTab>("posters");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Password errata. Riprova.");
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-6 rounded-2xl border border-ink-800 bg-ink-900 p-8 animate-scale-in"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink-800">
              <Lock className="h-7 w-7 text-neon" />
            </div>
            <h1 className="font-sans text-2xl text-white">Area Riservata</h1>
            <p className="text-sm text-ink-400">Inserisci la password per accedere al pannello admin.</p>
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
            />
          </div>
          {authError && <p className="text-sm text-red-400 animate-fade-in">{authError}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-ink-100 px-4 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-white"
          >
            Accedi
          </button>
          <a href="/" className="block text-center text-xs text-ink-500 hover:text-ink-300 transition-colors">
            ← Torna al sito
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl text-white">Pannello Admin</h1>
            <p className="mt-1 text-sm text-ink-400">Gestisci locandine, richieste e contatti.</p>
          </div>
          <a href="/" className="text-sm text-ink-400 hover:text-white transition-colors">
            ← Torna al sito
          </a>
        </div>

        <div className="mb-6 flex gap-1 rounded-lg border border-ink-800 bg-ink-900 p-1">
          <button
            onClick={() => setTab("posters")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              tab === "posters" ? "bg-ink-100 text-ink-950" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            Locandine
          </button>
          <button
            onClick={() => setTab("requests")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              tab === "requests" ? "bg-ink-100 text-ink-950" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            Richieste
          </button>
          <button
            onClick={() => setTab("promoters")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              tab === "promoters" ? "bg-ink-100 text-ink-950" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            Promoter
          </button>
          <button
            onClick={() => setTab("contacts")}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
              tab === "contacts" ? "bg-ink-100 text-ink-950" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            Contatti
          </button>
        </div>

        {tab === "posters" ? <PostersTab /> : tab === "requests" ? <RequestsTab /> : tab === "promoters" ? <PromotersTab /> : <ContactsTab />}
      </div>
    </div>
  );
}

function PostersTab() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Poster | null>(null);

  const loadPosters = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posters")
      .select("*")
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    setPosters(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosters();
  }, [loadPosters]);

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa locandina?")) return;
    await supabase.from("posters").delete().eq("id", id);
    loadPosters();
  };

  const handleEdit = (poster: Poster) => {
    setEditing(poster);
    setShowForm(true);
  };

  const handleToggleFeatured = async (poster: Poster) => {
    if (poster.is_featured) {
      await supabase.from("posters").update({ is_featured: false }).eq("id", poster.id);
    } else {
      await supabase.from("posters").update({ is_featured: false }).not("id", "is", null);
      await supabase.from("posters").update({ is_featured: true }).eq("id", poster.id);
    }
    loadPosters();
  };

  const handleToggleSoldOut = async (poster: Poster) => {
    await supabase.from("posters").update({ sold_out: !poster.sold_out }).eq("id", poster.id);
    loadPosters();
  };

  const handleToggleHidden = async (poster: Poster) => {
    await supabase.from("posters").update({ is_hidden: !poster.is_hidden }).eq("id", poster.id);
    loadPosters();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="flex items-center gap-2 rounded-lg bg-neon px-5 py-2.5 text-sm font-bold text-ink-950 transition-all hover:bg-neon-dark"
      >
        <Plus className="h-4 w-4" />
        Aggiungi Locandina
      </button>

      {showForm && (
        <PosterForm
          poster={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditing(null);
            loadPosters();
          }}
        />
      )}

      {loading ? (
        <p className="text-sm text-ink-400">Caricamento...</p>
      ) : posters.length === 0 ? (
        <p className="text-sm text-ink-500">Nessuna locandina pubblicata.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posters.map((poster) => (
            <div
              key={poster.id}
              className={`overflow-hidden rounded-xl border bg-ink-900 ${
                poster.is_featured ? "border-cyan-400/60 ring-1 ring-cyan-400/30" : "border-ink-800"
              }`}
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={poster.image_url} alt={poster.title} className="h-full w-full object-cover" />
                {poster.is_featured && (
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-cyan-400 px-2 py-0.5">
                    <Star className="h-3 w-3 text-ink-950 fill-ink-950" />
                    <span className="text-xs font-bold text-ink-950">In evidenza</span>
                  </div>
                )}
                {poster.sold_out && (
                  <div className="absolute left-2 top-2 rounded-full bg-red-600 px-3 py-1 shadow-lg">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">SOLD OUT</span>
                  </div>
                )}
                {poster.is_hidden && (
                  <div className="absolute left-2 bottom-2 flex items-center gap-1 rounded-full bg-amber-600 px-2 py-0.5">
                    <EyeOff className="h-3 w-3 text-white" />
                    <span className="text-xs font-bold text-white">Nascosto</span>
                  </div>
                )}
                {poster.publish_at && new Date(poster.publish_at) > new Date() && (
                  <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-cyan-500 px-2 py-0.5">
                    <Clock className="h-3 w-3 text-ink-950" />
                    <span className="text-xs font-bold text-ink-950">Programmato</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-cyan-300">{poster.category}</span>
                {poster.event_date && (
                  <span className="ml-2 text-xs text-ink-400">
                    {new Date(poster.event_date).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </span>
                )}
                <h3 className="mt-1 font-sans text-lg text-white">{poster.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-ink-400">{poster.short_description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(poster)}
                    className="flex items-center gap-1.5 rounded-lg border border-ink-700 px-3 py-2 text-xs font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifica
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(poster)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      poster.is_featured
                        ? "border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
                        : "border-ink-700 text-ink-200 hover:border-cyan-400/50 hover:text-cyan-300"
                    }`}
                  >
                    <Star className={`h-3.5 w-3.5 ${poster.is_featured ? "fill-cyan-300" : ""}`} />
                    {poster.is_featured ? "Rimuovi evidenza" : "Metti in evidenza"}
                  </button>
                  <button
                    onClick={() => handleToggleSoldOut(poster)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                      poster.sold_out
                        ? "border-red-500 bg-red-600 text-white hover:bg-red-500"
                        : "border-red-900/50 text-red-400 hover:bg-red-950/30"
                    }`}
                  >
                    {poster.sold_out ? "Rimuovi SOLD OUT" : "Segna SOLD OUT"}
                  </button>
                  <button
                    onClick={() => handleToggleHidden(poster)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      poster.is_hidden
                        ? "border-amber-500 bg-amber-600 text-white hover:bg-amber-500"
                        : "border-ink-700 text-ink-200 hover:border-amber-500/50 hover:text-amber-300"
                    }`}
                  >
                    {poster.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {poster.is_hidden ? "Mostra" : "Nascondi"}
                  </button>
                  <button
                    onClick={() => handleDelete(poster.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-900/50 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/30"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PosterForm({
  poster,
  onClose,
  onSaved,
}: {
  poster: Poster | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(poster?.title || "");
  const [category, setCategory] = useState(poster?.category || "");
  const [imageUrl, setImageUrl] = useState(poster?.image_url || "");
  const [shortDesc, setShortDesc] = useState(poster?.short_description || "");
  const [fullDesc, setFullDesc] = useState(poster?.full_description || "");
  const [eventDate, setEventDate] = useState(poster?.event_date || "");
  const [isHidden, setIsHidden] = useState(poster?.is_hidden ?? false);
  const [publishAt, setPublishAt] = useState(poster?.publish_at ? new Date(poster.publish_at).toISOString().slice(0, 16) : "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("posters")
        .upload(fileName, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage
        .from("posters")
        .getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
    } catch {
      setError("Errore nel caricamento dell'immagine.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !imageUrl.trim() || !shortDesc.trim() || !fullDesc.trim()) {
      setError("Tutti i campi sono obbligatori.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title,
        category,
        image_url: imageUrl,
        short_description: shortDesc,
        full_description: fullDesc,
        event_date: eventDate || null,
        is_hidden: isHidden,
        publish_at: publishAt ? new Date(publishAt).toISOString() : null,
      };
      if (poster) {
        const { error: updErr } = await supabase
          .from("posters")
          .update(payload)
          .eq("id", poster.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase.from("posters").insert(payload);
        if (insErr) throw insErr;
      }
      onSaved();
    } catch {
      setError("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <form
        className="relative my-8 w-full max-w-lg space-y-5 rounded-2xl border border-ink-700 bg-ink-950 p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-xl text-white">
            {poster ? "Modifica Locandina" : "Nuova Locandina"}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-800 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Titolo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Categoria / Data</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="es. Musica · 15 Giugno 2026"
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-neon" />
            Data dell'evento (per ordinamento cronologico)
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
          />
          <p className="mt-1 text-xs text-ink-500">Gli eventi piu recenti appaiono per primi.</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-neon" />
            Programma uscita (opzionale)
          </label>
          <input
            type="datetime-local"
            value={publishAt}
            onChange={(e) => setPublishAt(e.target.value)}
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
          />
          <p className="mt-1 text-xs text-ink-500">L'evento sara visibile sul sito solo a partire da questa data e ora. Lascia vuoto per pubblicarlo subito.</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900 px-4 py-3">
          <div>
            <span className="text-xs font-medium text-ink-200">Nascondi ai visitatori</span>
            <p className="text-xs text-ink-500 mt-0.5">Se attivo, l'evento non sara visibile sul sito pubblico.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsHidden(!isHidden)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isHidden ? "bg-amber-500" : "bg-ink-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isHidden ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Immagine</label>
          <div className="space-y-2">
            {imageUrl && (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-ink-700">
                <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
              </div>
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-ink-600 px-4 py-3 text-sm text-ink-300 hover:border-neon hover:text-neon transition-colors">
              <ImageIcon className="h-4 w-4" />
              {uploading ? "Caricamento..." : "Carica immagine"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="o incolla URL immagine"
                className="flex-1 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:border-neon focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Descrizione Breve</label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors resize-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Descrizione Completa</label>
          <textarea
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-400 animate-fade-in">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-ink-700 px-4 py-2.5 text-sm font-medium text-ink-300 hover:bg-ink-800 transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-ink-100 px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-white disabled:opacity-50 transition-all"
          >
            {saving ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RequestsTab() {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const toggleStatus = async (req: CustomerRequest) => {
    const newStatus = req.status === "pending" ? "completed" : "pending";
    await supabase.from("requests").update({ status: newStatus }).eq("id", req.id);
    loadRequests();
  };

  const cycleSaleStatus = async (req: CustomerRequest) => {
    const order: SaleStatus[] = ["none", "sold", "not_sold"];
    const idx = order.indexOf(req.sale_status || "none");
    const next = order[(idx + 1) % order.length];
    await supabase.from("requests").update({ sale_status: next }).eq("id", req.id);
    loadRequests();
  };

  const soldCount = requests.filter((r) => r.sale_status === "sold").length;
  const notSoldCount = requests.filter((r) => r.sale_status === "not_sold").length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <p className="text-sm text-ink-400">Caricamento...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-ink-400">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{requests.length} richieste totali</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <span className="text-green-400">{soldCount} vendute</span>
        </div>
        <div className="flex items-center gap-2">
          <XIcon className="h-4 w-4 text-red-400" />
          <span className="text-red-400">{notSoldCount} non vendute</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-ink-800 bg-ink-900 p-12 text-center">
          <p className="text-sm text-ink-500">Nessuna richiesta ricevuta.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto overflow-hidden rounded-xl border border-ink-800 bg-ink-900 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-800 bg-ink-900">
                <tr className="text-xs text-ink-400">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Locandina</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Canale</th>
                  <th className="px-4 py-3 font-medium">Contatto</th>
                  <th className="px-4 py-3 font-medium">Inviato da</th>
                  <th className="px-4 py-3 font-medium">Vendita</th>
                  <th className="px-4 py-3 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-ink-400 whitespace-nowrap">
                      {formatDate(req.created_at)}
                    </td>
                    <td className="px-4 py-3 text-ink-200 max-w-[160px] truncate">
                      {req.poster_title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        req.request_type === "purchase" ? "bg-neon/10 text-neon" : "bg-ink-700 text-ink-200"
                      }`}>
                        {req.request_type === "purchase" ? "Acquisto" : "Info"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-ink-300">
                        {req.contact_type === "phone" ? (
                          <><Phone className="h-3.5 w-3.5" /> Telefono</>
                        ) : (
                          <><Instagram className="h-3.5 w-3.5" /> Instagram</>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={getContactActionUrl(req.contact_value, req.contact_type)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-ink-200 hover:text-neon transition-colors"
                      >
                        {req.contact_value}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-300">
                      {req.referrer ? (
                        <a
                          href={getInstagramUrl(req.referrer)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-ink-200 hover:text-neon transition-colors"
                        >
                          {req.referrer}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-ink-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(req)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          req.status === "completed" ? "bg-neon" : "bg-ink-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            req.status === "completed" ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {requests.map((req) => (
              <div key={req.id} className="rounded-xl border border-ink-800 bg-ink-900 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-100 truncate">{req.poster_title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{formatDate(req.created_at)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
                    req.request_type === "purchase" ? "bg-neon/10 text-neon" : "bg-ink-700 text-ink-200"
                  }`}>
                    {req.request_type === "purchase" ? "Acquisto" : "Info"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={getContactActionUrl(req.contact_value, req.contact_type)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-ink-200 hover:text-neon transition-colors min-w-0"
                  >
                    {req.contact_type === "phone" ? <Phone className="h-4 w-4 shrink-0" /> : <Instagram className="h-4 w-4 shrink-0" />}
                    <span className="truncate">{req.contact_value}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
                {req.referrer && (
                  <div className="flex items-center gap-1.5 text-xs text-ink-400">
                    <span>Inviato da:</span>
                    <a
                      href={getInstagramUrl(req.referrer)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ink-200 hover:text-neon transition-colors"
                    >
                      {req.referrer}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => cycleSaleStatus(req)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                      req.sale_status === "sold"
                        ? "bg-green-500 text-white"
                        : req.sale_status === "not_sold"
                        ? "bg-red-500 text-white"
                        : "bg-ink-700 text-ink-300 hover:bg-ink-600"
                    }`}
                  >
                    {req.sale_status === "sold" ? "Venduta" : req.sale_status === "not_sold" ? "Non venduta" : "Da definire"}
                  </button>
                  <button
                    onClick={() => toggleStatus(req)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                      req.status === "completed" ? "bg-neon" : "bg-ink-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        req.status === "completed" ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState<SiteContacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("site_contacts")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) {
      setContacts(data);
      setEmail(data.email);
      setPhone(data.phone);
      setInstagram(data.instagram || "");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) {
      setError("Email e telefono sono obbligatori.");
      return;
    }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const igValue = instagram.trim() ? (instagram.trim().startsWith("@") ? instagram.trim() : `@${instagram.trim()}`) : null;
      if (contacts) {
        const { error: updErr } = await supabase
          .from("site_contacts")
          .update({ email: email.trim(), phone: phone.trim(), instagram: igValue, updated_at: new Date().toISOString() })
          .eq("id", contacts.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase
          .from("site_contacts")
          .insert({ email: email.trim(), phone: phone.trim(), instagram: igValue });
        if (insErr) throw insErr;
      }
      setSaved(true);
      loadContacts();
    } catch {
      setError("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink-400">Caricamento...</p>;

  return (
    <div className="max-w-lg">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-neon" />
        <h2 className="font-sans text-xl text-white">Contatti del sito</h2>
      </div>
      <p className="mb-6 text-sm text-ink-400">
        Questi contatti vengono mostrati nella sezione "Contatti" del sito pubblico.
      </p>
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full rounded-lg border border-ink-700 bg-ink-900 pl-10 pr-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Telefono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+39 ..."
              className="w-full rounded-lg border border-ink-700 bg-ink-900 pl-10 pr-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-300">Instagram (opzionale)</label>
          <div className="relative">
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@account"
              className="w-full rounded-lg border border-ink-700 bg-ink-900 pl-10 pr-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-400 animate-fade-in">{error}</p>}
        {saved && <p className="text-sm text-neon animate-fade-in">Contatti salvati con successo!</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-ink-100 px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-white disabled:opacity-50 transition-all"
        >
          {saving ? "Salvataggio..." : "Salva Contatti"}
        </button>
      </form>
    </div>
  );
}

function PromotersTab() {
  const [applications, setApplications] = useState<PromoterApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("promoter_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const cycleStatus = async (app: PromoterApplication) => {
    const order: PromoterStatus[] = ["pending", "reviewed", "hired"];
    const idx = order.indexOf(app.status);
    const next = order[(idx + 1) % order.length];
    await supabase.from("promoter_applications").update({ status: next }).eq("id", app.id);
    loadApplications();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questa candidatura?")) return;
    await supabase.from("promoter_applications").delete().eq("id", id);
    loadApplications();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <p className="text-sm text-ink-400">Caricamento...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-ink-400">
        <Briefcase className="h-4 w-4" />
        <span>{applications.length} candidature totali</span>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-ink-800 bg-ink-900 p-12 text-center">
          <p className="text-sm text-ink-500">Nessuna candidatura ricevuta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div key={app.id} className="rounded-xl border border-ink-800 bg-ink-900 p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-sans text-lg text-white">{app.first_name} {app.last_name}</h3>
                  <p className="text-xs text-ink-500 mt-0.5">{formatDate(app.created_at)}</p>
                </div>
                <button
                  onClick={() => cycleStatus(app)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    app.status === "hired"
                      ? "bg-green-500 text-white"
                      : app.status === "reviewed"
                      ? "bg-cyan-400 text-ink-950"
                      : "bg-ink-700 text-ink-300 hover:bg-ink-600"
                  }`}
                >
                  {app.status === "hired" ? "Assunto" : app.status === "reviewed" ? "Visto" : "In attesa"}
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-ink-300">
                  <span className="text-xs text-ink-500 w-20 shrink-0">Esperienza</span>
                  <span className={`text-xs font-medium ${app.has_experience ? "text-green-400" : "text-ink-400"}`}>
                    {app.has_experience ? "Si" : "No"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-500 w-20 shrink-0">Telefono</span>
                  <a
                    href={getWhatsAppUrl(app.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-ink-200 hover:text-neon transition-colors min-w-0"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{app.phone}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-500 w-20 shrink-0">Instagram</span>
                  <a
                    href={getInstagramUrl(app.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-ink-200 hover:text-neon transition-colors min-w-0"
                  >
                    <Instagram className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{app.instagram}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleDelete(app.id)}
                className="flex items-center gap-1.5 rounded-lg border border-red-900/50 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Elimina
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
