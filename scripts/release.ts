import { getPackages } from '@manypkg/get-packages';
import * as process from 'process';
// @ts-ignore
import prompts from 'prompts';
import { red } from 'kolorist';

import { run } from './utils';

async function main() {
  const { tool, root, packages } = await getPackages(process.cwd());

  const answer = await prompts<'package'>(
    [
      {
        type: 'select',
        name: 'package',
        message: 'Select a package to release',
        choices: packages.concat(root).map(pkg => ({
          title: pkg.packageJson.name,
          value: pkg
        })),
      }
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled');
      },
    },
  )

  // https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-cli/cli.js
  const changelogArgs = [
    'conventional-changelog',
    '-p',
    'angular',
    '-i',
    'CHANGELOG.md',
    '-s',
    '--commit-path',
    '.',
    '-l',
    '--skip-unstable'
  ];
  await run(tool, changelogArgs, { cwd: answer.package.dir });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
