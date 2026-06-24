let suppressPersist = false;

export function withSuppressedPersist(fn: () => void): void {
  suppressPersist = true;
  try {
    fn();
  } finally {
    suppressPersist = false;
  }
}

export function isPersistSuppressed(): boolean {
  return suppressPersist;
}
