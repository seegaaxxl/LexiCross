export interface Profile {
  locale: string;
  alphabet: string;
  case: 'upper' | 'lower';
  map: Record<string, string>;
  strip: string[];
  rareLetters: Record<string, number>;
}

export function normalizeWord(raw: string, profile: Profile): string | null {
  // 1. trim
  let word = raw.trim();

  // 2. convert case
  word = profile.case === 'upper' ? word.toUpperCase() : word.toLowerCase();

  // 3. apply profile.map character-by-character
  word = Array.from(word)
    .map((ch) => (Object.prototype.hasOwnProperty.call(profile.map, ch) ? profile.map[ch] : ch))
    .join('');

  // 4. remove every character present in profile.strip
  const stripSet = new Set(profile.strip);
  word = Array.from(word)
    .filter((ch) => !stripSet.has(ch))
    .join('');

  // 5. reject if any character is not in profile.alphabet
  const alphabetSet = new Set(Array.from(profile.alphabet));
  for (const ch of word) {
    if (!alphabetSet.has(ch)) {
      return null;
    }
  }

  // 6. reject if length < 2
  if (word.length < 2) {
    return null;
  }

  // 7. return the resulting string
  return word;
}
