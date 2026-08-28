/** RHF `setValueAs` helpers so empty inputs become `undefined`, not `''`/`NaN`. */
export const emptyToUndefined = (value: string): string | undefined =>
  value.trim() === '' ? undefined : value;

export const numberOrUndefined = (value: string): number | undefined =>
  value.trim() === '' ? undefined : Number(value);
