const TONES: Record<string, string> = {
  // property
  draft: 'bg-charcoal/10 text-charcoal',
  published: 'bg-success/15 text-success',
  unavailable: 'bg-warning/15 text-warning',
  let_or_sold: 'bg-info/15 text-info',
  archived: 'bg-muted/15 text-muted',
  // leads
  new: 'bg-gold/20 text-gold-deep',
  contacted: 'bg-info/15 text-info',
  in_progress: 'bg-warning/15 text-warning',
  closed: 'bg-muted/15 text-muted',
  // viewings
  scheduled: 'bg-info/15 text-info',
  completed: 'bg-success/15 text-success',
  cancelled: 'bg-muted/15 text-muted',
  // submissions
  in_review: 'bg-warning/15 text-warning',
  converted: 'bg-success/15 text-success',
  declined: 'bg-muted/15 text-muted',
};

export function StatusBadge({ status }: { status: string }) {
  const tone = TONES[status] ?? 'bg-charcoal/10 text-charcoal';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${tone}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
