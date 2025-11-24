export function compareVersions(v1: string, v2: string): number {
  const normalize = (v: string) =>
    v
      .replace(/^v/i, '')
      .split('.')
      .map((n) => Number(n) || 0);

  const a = normalize(v1);
  const b = normalize(v2);

  const maxLen = Math.max(a.length, b.length);

  for (let i = 0; i < maxLen; i++) {
    const partA = a[i] ?? 0;
    const partB = b[i] ?? 0;

    if (partA > partB) return 1;
    if (partA < partB) return -1;
  }

  return 0; // equal
}
