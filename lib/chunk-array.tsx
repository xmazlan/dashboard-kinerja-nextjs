export function chunkArray<T>(arr: T[], size: number): T[][] {
  if (!Array.isArray(arr)) return [];

  return arr.reduce((acc: T[][], _, idx) => {
    if (idx % size === 0) acc.push(arr.slice(idx, idx + size));
    return acc;
  }, []);
}