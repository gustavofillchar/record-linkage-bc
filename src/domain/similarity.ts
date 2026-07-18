import { normalizeName } from "./normalization";

export function nameSimilarity(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);

  if (tokensA.size === 0 || tokensB.size === 0) {
    return 0;
  }

  const intersection = [...tokensA].filter((token) => tokensB.has(token)).length;
  const union = new Set([...tokensA, ...tokensB]).size;

  return intersection / union;
}

function tokenize(value: string): Set<string> {
  const normalized = normalizeName(value);

  if (normalized === "") {
    return new Set();
  }

  return new Set(normalized.split(" "));
}
