import { describe, expect, it } from 'vitest';
import { signature } from '../../src/index/signature.js';
import type { Profile } from '../../src/dataset/normalize.js';

const profile: Profile = {
  locale: 'test',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  case: 'upper',
  map: {},
  strip: [],
  rareLetters: {},
};

describe('signature', () => {
  it('collapses anagrams to one signature', () => {
    expect(signature('STOP', profile)).toBe(signature('POTS', profile));
    expect(signature('STOP', profile)).toBe(signature('SPOT', profile));
  });

  it('sorts by profile.alphabet position, not ASCII order', () => {
    const reversedProfile: Profile = {
      ...profile,
      alphabet: 'ZYXWVUTSRQPONMLKJIHGFEDCBA',
    };

    // Under ASCII/default order "BA" -> "AB"; under the reversed
    // alphabet, B comes before A, so the signature should stay "BA".
    expect(signature('AB', reversedProfile)).toBe('BA');
    expect(signature('AB', profile)).toBe('AB');
  });
});
