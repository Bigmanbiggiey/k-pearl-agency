/** RHF `setValueAs` helpers for the staff property editor (empty → null). */
export const emptyToNull = (value: string): string | null => (value.trim() === '' ? null : value);

export const numberOrNull = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};
