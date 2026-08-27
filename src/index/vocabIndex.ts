import type { Profile } from '../dataset/normalize.js';
import { buildAlphabetIndex, toCounts, type Counts } from './counts.js';
import { signature } from './signature.js';

export interface VocabIndex {
  profile: Profile;
  alphabetIndex: Map<string, number>;
  bySignature: Map<string, string[]>;
  role: Map<string, 'core' | 'bonus'>;
  rank: Map<string, number>;
  counts: Map<string, Counts>;
  hash: string;
}

export interface VocabEntry {
  word: string;
  role: 'core' | 'bonus';
  rank: number;
}

export function buildVocabIndex(
  profile: Profile,
  entries: VocabEntry[],
  hash: string,
): VocabIndex {
  const alphabetIndex = buildAlphabetIndex(profile);
  const bySignature = new Map<string, string[]>();
  const role = new Map<string, 'core' | 'bonus'>();
  const rank = new Map<string, number>();
  const counts = new Map<string, Counts>();

  const seen = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.word)) {
      throw new Error(`buildVocabIndex: duplicate word "${entry.word}" in entries`);
    }
    seen.add(entry.word);

    counts.set(entry.word, toCounts(entry.word, alphabetIndex));
    role.set(entry.word, entry.role);
    rank.set(entry.word, entry.rank);

    const sig = signature(entry.word, profile);
    const group = bySignature.get(sig);
    if (group) {
      group.push(entry.word);
    } else {
      bySignature.set(sig, [entry.word]);
    }
  }

  for (const group of bySignature.values()) {
    group.sort();
  }

  return {
    profile,
    alphabetIndex,
    bySignature,
    role,
    rank,
    counts,
    hash,
  };
}
