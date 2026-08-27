import { describe, expect, it } from 'vitest';
import { run } from '../../src/cli.js';

describe('cli', () => {
  it('prints usage and exits 1 on unknown command', () => {
    expect(() => run(['bogus'])).not.toThrow();
    expect(run(['bogus'])).toBe(1);
  });

  it('prints usage and exits 1 on no command', () => {
    expect(run([])).toBe(1);
  });

  it('exits 0 for each stub command', () => {
    const commands = [
      'generate',
      'inspect',
      'rescore',
      'cluster',
      'stats',
      'filter',
      'review',
      'prune',
      'export',
      'diff',
    ];
    for (const command of commands) {
      expect(() => run([command])).not.toThrow();
      expect(run([command])).toBe(0);
    }
  });
});
