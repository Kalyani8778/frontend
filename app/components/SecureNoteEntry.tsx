"use client";

import PiiDetectedBadge from "./PiiDetectedBadge";

export interface SecureNote {
  id: string;
  call_id: string;
  agent_id: string | null;
  redacted_note: string;
  pii_detected: string[];
  created_at: string;
}

interface SecureNoteEntryProps {
  note: SecureNote;
}

export default function SecureNoteEntry({ note }: SecureNoteEntryProps) {
  const time = new Date(note.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="snote-entry">
      <div className="snote-meta">
        <span className="snote-time">{time}</span>
        {note.agent_id && (
          <span className="snote-agent">Agent: {note.agent_id}</span>
        )}
        <PiiDetectedBadge types={note.pii_detected} />
      </div>
      <p className="snote-text">{note.redacted_note}</p>
    </div>
  );
}
