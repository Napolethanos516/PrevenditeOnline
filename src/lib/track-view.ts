const SESSION_KEY = "po_session_id";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

type TrackViewParams = {
  view_type?: "site" | "poster";
  poster_id?: string;
};

export function trackView(params: TrackViewParams = {}): void {
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-view`;
    fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        view_type: params.view_type || "site",
        poster_id: params.poster_id || null,
        referrer: document.referrer || null,
      }),
    }).catch(() => {});
  } catch {
    // ignore tracking errors
  }
}
