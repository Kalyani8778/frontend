import { maskPhone, maskEmail, maskCard } from "../../lib/maskUtils";

type MaskType = "phone" | "email" | "card";

interface MaskedTextProps {
  value: string;
  type: MaskType;
  className?: string;
}

// Displays a masked version of sensitive data with a subtle lock icon.
export function MaskedText({ value, type, className }: MaskedTextProps) {
  const masked =
    type === "phone" ? maskPhone(value) :
    type === "email" ? maskEmail(value) :
    maskCard(value);

  return (
    <span
      className={`masked-text${className ? ` ${className}` : ""}`}
      title={`Masked for security — ${type}`}
    >
      <svg
        className="masked-lock-mini"
        width="10" height="10" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {masked}
    </span>
  );
}
