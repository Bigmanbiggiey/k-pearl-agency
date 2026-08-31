/**
 * RHF `setValueAs` helpers for the staff property editor (empty → null).
 * `setValueAs` doesn't only run against the raw DOM input string — RHF also
 * re-runs it against whatever is already in its internal state on
 * register/reset, which for these fields is the *typed* form value: `null`
 * (the default for an empty numeric field, docs/database.md) or a plain
 * `number` (set directly by `reset(toForm(record))` after a save/reload).
 * Both must be handled, not just the string the user actually typed.
 */
export const emptyToNull = (value: string | null): string | null =>
  value === null || value.trim() === '' ? null : value;

export const numberOrNull = (value: string | number | null): number | null => {
  if (value === null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};
