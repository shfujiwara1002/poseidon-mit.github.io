import { Link } from '../router';

export function BackButton({ to, label = 'Back' }: { to: string; label?: string }) {
  return (
    <Link to={to} className="entry-back-button" aria-label={label}>
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </Link>
  );
}
