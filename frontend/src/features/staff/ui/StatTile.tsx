import { Link } from 'react-router-dom';

interface Props {
  label: string;
  value: number | string;
  to?: string;
  emphasis?: boolean;
}

export function StatTile({ label, value, to, emphasis }: Props) {
  const body = (
    <div
      className={`rounded-md border p-4 ${
        emphasis && value !== 0 ? 'border-gold bg-gold/10' : 'border-line bg-ivory'
      }`}
    >
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
  return to ? (
    <Link to={to} className="block transition-shadow hover:shadow-sm">
      {body}
    </Link>
  ) : (
    body
  );
}
