"use client";

interface PiiDetectedBadgeProps {
  types: string[];
}

export default function PiiDetectedBadge({ types }: PiiDetectedBadgeProps) {
  if (!types || types.length === 0) return null;

  const labels: Record<string, string> = {
    email: "Email",
    card:  "Card",
    phone: "Phone",
  };

  return (
    <span className="pii-badge-group">
      {types.map((t) => (
        <span key={t} className="pii-badge">
          <span className="pii-badge-icon">&#128274;</span>
          {labels[t] ?? t} redacted
        </span>
      ))}
    </span>
  );
}
