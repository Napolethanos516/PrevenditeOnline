# PrevenditeOnline

Sito React + Vite per mostrare locandine eventi e raccogliere richieste di prevendita (acquisto in persona) e candidature promoter.

## Stack e entrypoint

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Entrypoint app:** `src/main.tsx`
- **Componente principale:** `src/App.tsx`
- **Build output:** `dist/`
- **Integrazione dati:** Supabase (`src/lib/supabase.ts`)
- **Funzioni edge:** cartella `supabase/functions/`

## Prerequisiti

- Node.js 18+
- npm 9+

## Installazione

```bash
npm install
```

## Variabili d'ambiente

Crea un file `.env` locale (non versionato):

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## Comandi disponibili

```bash
npm run dev        # sviluppo locale
npm run build      # build produzione
npm run preview    # anteprima build
npm run lint       # lint ESLint
npm run typecheck  # controllo TypeScript
```

> Nota: al momento non è presente una suite di test automatizzati dedicata (es. Vitest/Jest).

## Struttura progetto

```text
src/
  components/      # UI (hero, card, form, modali, admin)
  lib/             # utilità Supabase, contatti, tracking, formattazione
  types/           # tipi TypeScript condivisi
public/            # asset statici e redirect Netlify SPA
supabase/          # config, migrations e edge functions
```

## Deploy statico

Il progetto è predisposto per hosting statico con fallback SPA:

- **Netlify:** `netlify.toml` + `public/_redirects`
- **Vercel:** `vercel.json`

### Deploy su Netlify

1. Collega il repository.
2. Imposta:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configura le environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Avvia il deploy.

### Deploy su Vercel

1. Importa il repository in Vercel.
2. Framework preset: **Vite**.
3. Inserisci le env vars richieste.
4. Deploy.

## Dominio personalizzato (passi residui)

1. Aggiungi il dominio nella dashboard del provider (Netlify o Vercel).
2. Configura i record DNS richiesti dal provider.
3. Verifica certificato SSL e propagazione DNS.
4. Aggiorna eventuali URL pubblici/documentazione con un placeholder del tipo `https://example-domain.tld` finché il dominio reale non è attivo.

## Limiti funzionali

- Nessun backend di pagamento reale: il sito raccoglie solo richieste di contatto/prenotazione.
- Prezzi e conferma finale avvengono offline (acquisto in persona).

## Archivio originale

L'archivio iniziale `project-bolt-sb1-fum3dduf.zip` è mantenuto in root come copia sorgente originale.
