export function BagMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="HAUL smile bag logo">
      <path d="M9 17.5h30l-2.7 24H11.7L9 17.5Z" fill="currentColor" />
      <path d="M17 18v-3.2C17 10.5 20.1 7 24 7s7 3.5 7 7.8V18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M17.5 28.5c1.8 4 4.2 6 7 6s5.2-2 7-6" stroke="var(--surface)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark() {
  return <span className="wordmark">HAUL</span>;
}
