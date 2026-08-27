import { describe, expect, it } from 'vitest';
import { normalizeWord, type Profile } from '../../src/dataset/normalize.js';

const upperProfile: Profile = {
  locale: 'test',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  case: 'upper',
  map: { É: 'E' },
  strip: ['-', "'", ' '],
  rareLetters: {},
};

const lowerProfile: Profile = {
  ...upperProfile,
  alphabet: 'abcdefghijklmnopqrstuvwxyz',
  case: 'lower',
  map: { é: 'e' },
};

describe('normalizeWord', () => {
  it('trims leading/trailing whitespace', () => {
    expect(normalizeWord('  cat  ', upperProfile)).toBe('CAT');
  });

  it('applies case conversion (upper)', () => {
    expect(normalizeWord('cat', upperProfile)).toBe('CAT');
  });

  it('applies case conversion (lower)', () => {
    expect(normalizeWord('CAT', lowerProfile)).toBe('cat');
  });

  it('applies profile.map after case folding', () => {
    expect(normalizeWord('café', upperProfile)).toBe('CAFE');
  });

  it('strips configured characters: hyphen', () => {
    expect(normalizeWord('co-op', upperProfile)).toBe('COOP');
  });

  it('strips configured characters: apostrophe', () => {
    expect(normalizeWord("it's", upperProfile)).toBe('ITS');
  });

  it('rejects a word with a digit outside the alphabet', () => {
    expect(normalizeWord('cat9', upperProfile)).toBeNull();
  });

  it('rejects a word with an unmapped accented letter', () => {
    expect(normalizeWord('naïve', upperProfile)).toBeNull();
  });

  it('rejects length < 2 after normalization: single letter', () => {
    expect(normalizeWord('a', upperProfile)).toBeNull();
  });

  it('rejects length < 2 when length drops below 2 only after stripping', () => {
    expect(normalizeWord('a-', upperProfile)).toBeNull();
  });

  it('passes a normal valid word through correctly', () => {
    expect(normalizeWord('dog', upperProfile)).toBe('DOG');
  });
});
