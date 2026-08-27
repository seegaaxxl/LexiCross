import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DEMO_DIR = join(__dirname, '../../data/demo');

type DemoProfile = {
  locale: string;
  alphabet: string;
  case: 'upper' | 'lower';
  map: Record<string, string>;
  strip: string[];
  rareLetters: Record<string, number>;
};

const PROFILE_KEYS = ['locale', 'alphabet', 'case', 'map', 'strip', 'rareLetters'] as const;

function readRaw(path: string): string {
  return readFileSync(join(DEMO_DIR, path), 'latin1');
}

function readLines(path: string): string[] {
  const raw = readFileSync(join(DEMO_DIR, path), 'utf8');
  // Split on \n only; a trailing \r would surface as part of the last
  // element of a line and get caught by the charset assertion below.
  const withoutTrailingNewline = raw.endsWith('\n') ? raw.slice(0, -1) : raw;
  return withoutTrailingNewline.split('\n');
}

describe('demo dataset: profile.json', () => {
  const raw = readRaw('profile.json');

  it('parses as JSON', () => {
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  const profile = JSON.parse(raw) as DemoProfile;

  it('has exactly the required keys, no extras', () => {
    expect(Object.keys(profile).sort()).toEqual([...PROFILE_KEYS].sort());
  });

  it('locale is a string', () => {
    expect(typeof profile.locale).toBe('string');
  });

  it('alphabet is a string', () => {
    expect(typeof profile.alphabet).toBe('string');
  });

  it("case is 'upper' or 'lower'", () => {
    expect(['upper', 'lower']).toContain(profile.case);
  });

  it('map is a Record<string,string>', () => {
    expect(typeof profile.map).toBe('object');
    expect(profile.map).not.toBeNull();
    expect(Array.isArray(profile.map)).toBe(false);
    for (const [k, v] of Object.entries(profile.map as Record<string, unknown>)) {
      expect(typeof k).toBe('string');
      expect(typeof v).toBe('string');
    }
  });

  it('strip is a string[]', () => {
    expect(Array.isArray(profile.strip)).toBe(true);
    for (const v of profile.strip as unknown[]) {
      expect(typeof v).toBe('string');
    }
  });

  it('rareLetters is a Record<string,number>', () => {
    expect(typeof profile.rareLetters).toBe('object');
    expect(profile.rareLetters).not.toBeNull();
    expect(Array.isArray(profile.rareLetters)).toBe(false);
    for (const [k, v] of Object.entries(profile.rareLetters as Record<string, unknown>)) {
      expect(typeof k).toBe('string');
      expect(typeof v).toBe('number');
    }
  });
});

const SOURCE_FILES = {
  core: 'sources/core.txt',
  bonus: 'sources/bonus.txt',
  block: 'sources/block.txt',
} as const;

describe.each(Object.entries(SOURCE_FILES))('demo dataset: %s.txt', (name, path) => {
  const raw = readRaw(path);
  const lines = readLines(path);

  it('has no CRLF line endings', () => {
    expect(raw.includes('\r')).toBe(false);
  });

  it('has no blank lines', () => {
    expect(lines.every((line) => line.length > 0)).toBe(true);
  });

  it('has no leading/trailing whitespace on any line', () => {
    expect(lines.every((line) => line === line.trim())).toBe(true);
  });

  it('every line matches /^[a-z]+$/', () => {
    const bad = lines.filter((line) => !/^[a-z]+$/.test(line));
    expect(bad).toEqual([]);
  });

  it('has no duplicate lines', () => {
    expect(new Set(lines).size).toBe(lines.length);
  });
});

describe('demo dataset: cross-file disjointness', () => {
  const core = new Set(readLines(SOURCE_FILES.core));
  const bonus = new Set(readLines(SOURCE_FILES.bonus));
  const block = new Set(readLines(SOURCE_FILES.block));

  it('core and bonus share no words', () => {
    const overlap = [...core].filter((w) => bonus.has(w));
    expect(overlap).toEqual([]);
  });

  it('core and block share no words', () => {
    const overlap = [...core].filter((w) => block.has(w));
    expect(overlap).toEqual([]);
  });

  it('bonus and block share no words', () => {
    const overlap = [...bonus].filter((w) => block.has(w));
    expect(overlap).toEqual([]);
  });
});

describe('demo dataset: core.txt size', () => {
  it('has exactly 2000 lines', () => {
    const lines = readLines(SOURCE_FILES.core);
    expect(lines.length).toBe(2000);
  });
});

describe('demo dataset: known-good fixtures (regression)', () => {
  const core = new Set(readLines(SOURCE_FILES.core));
  const bonus = new Set(readLines(SOURCE_FILES.bonus));
  const coreAndBonus = new Set([...core, ...bonus]);

  it('"kitchen" is present in core.txt', () => {
    expect(core.has('kitchen')).toBe(true);
  });

  it.each(['chin', 'kite', 'tick', 'niche', 'thicken'])(
    '"%s" is present somewhere across core.txt + bonus.txt',
    (word) => {
      expect(coreAndBonus.has(word)).toBe(true);
    },
  );
});
