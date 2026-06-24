export function logSupabaseError(
  context: string,
  error: {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  },
): void {
  if (process.env.NODE_ENV === "production") return;

  console.error(`[Kodmigo] ${context}`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}
