#!/usr/bin/env node
import { parseArgs } from 'node:util';

const COMMANDS = [
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
] as const;

type Command = (typeof COMMANDS)[number];

function isCommand(value: string | undefined): value is Command {
  return COMMANDS.includes(value as Command);
}

function printUsage(): void {
  console.log('Usage: lexicross <command> [options]');
  console.log('Commands:');
  for (const command of COMMANDS) {
    console.log(`  ${command}`);
  }
}

export function run(argv: string[]): number {
  const { positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: false,
  });

  const command = positionals[0];

  if (!isCommand(command)) {
    printUsage();
    return 1;
  }

  console.log('not implemented yet');
  return 0;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  process.exit(run(process.argv.slice(2)));
}
