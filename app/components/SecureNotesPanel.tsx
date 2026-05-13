"use client";

import { useState } from "react";
import SecureNoteEntry, { SecureNote } from "./SecureNoteEntry";

interface SecureNotesPanelProps {
  callId: string;
  agentId: string | null;
  notes: SecureNote[];
  onNoteAdded: () => void;
}

export default function SecureNotesPanel({
  callId,
  agentId,
  notes,
  onNoteAdded,
}: SecureNotesPanelProps) {
  const [draft, setDraft]     = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/secure-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_id:  callId,
          raw_note: text,
          agent_id: agentId ?? "",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error((body as { error?: string }).error || `HTTP ${res.status}`);
      }

      setDraft("");
      onNoteAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="snote-panel">
      <div className="snote-header">
        <span className="snote-lock-icon">&#128274;</span>
        <span className="snote-title">Secure Notes</span>
        <span className="snote-subtitle">PII is automatically redacted before storage</span>
      </div>

      <form className="snote-form" onSubmit={handleSubmit}>
        <textarea
          className="snote-textarea"
          placeholder="Type a note… emails, phone numbers, and card numbers will be redacted automatically."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          disabled={saving}
        />
        {error && <p className="snote-error">{error}</p>}
        <button
          type="submit"
          className="snote-submit"
          disabled={saving || !draft.trim()}
        >
          {saving ? "Saving…" : "Save Note"}
        </button>
      </form>

      <div className="snote-list">
        {notes.length === 0 ? (
          <p className="snote-empty">No secure notes for this call yet.</p>
        ) : (
          notes.map((n) => <SecureNoteEntry key={n.id} note={n} />)
        )}
      </div>
    </div>
  );
}
