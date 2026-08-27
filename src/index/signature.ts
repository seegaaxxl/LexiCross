import type { Profile } from '../dataset/normalize.js';
import { buildAlphabetIndex } from './counts.js';

export function signature(word: string, profile: Profile): string {
  const alphabetIndex = buildAlphabetIndex(profile);
  return Array.from(word)
    .slice()
    .sort((a, b) => {
      const posA = alphabetIndex.get(a);
      const posB = alphabetIndex.get(b);
      if (posA === undefined || posB === undefined) {
        throw new Error(
          `signature: character not present in profile.alphabet ("${posA === undefined ? a : b}")`,
        );
      }
      return posA - posB;
    })
    .join('');
}
