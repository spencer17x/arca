import { getPackages, Package } from '@manypkg/get-packages';
import * as process from 'process';
import prompts from 'prompts';
import colors from 'picocolors';
import semver from 'semver';

import { getVersionChoices, logRecentCommits, pushToGithub, run, runIfNotDry, step, updateVersion } from './utils';
import { getConfig } from './getConfig';

const { mainPackage, autoPushToGithub } = getConfig();

async function main() {
  const { packages } = await getPackages(process.cwd());

  const answerPkg: { pkg: Package } = await prompts<'pkg'>({
    type: 'select',
    name: 'pkg',
    message: 'Select a package to release',
    choices: packages.map(pkg => ({
      title: pkg.packageJson.name,
      value: pkg
    })),
  });

  const { pkg: currentPkg } = answerPkg;
  const currentPkgName = currentPkg.packageJson.name;
  const currentPkgVersion = currentPkg.packageJson.version;
  const currentPkgDir = currentPkg.dir;

  step(`Package: ${currentPkgName}`);
  step(`Version: ${currentPkgVersion}`);

  await logRecentCommits(currentPkgName);

  const answerVersion = await prompts([
    {
      type: 'select',
      name: 'version',
      message: 'Select a version to release',
      choices: getVersionChoices(currentPkgVersion)
    },
    {
      type: prev => prev === 'custom' ? 'text' : null,
      name: 'version',
      message: 'Input custom version',
      initial: currentPkgVersion
    }
  ]);

  const targetVersion = answerVersion.version;

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const tag = currentPkgName === mainPackage ? `v${targetVersion}` : `${currentPkgName}@${targetVersion}`;

  const { yes }: { yes: boolean } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${colors.yellow(tag)} Confirm?`
  });

  if (!yes) {
    return;
  }

  step('\nUpdating package version...');
  updateVersion(`${currentPkg.dir}/package.json`, targetVersion);

  step('\nGenerating changelog...');
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
    // '--skip-unstable'
  ];
  if (currentPkgName !== mainPackage) {
    changelogArgs.push('-l', currentPkgName);
  }
  await run('npx', changelogArgs, { cwd: currentPkgDir });

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-m', `release: ${tag}`]);
    await runIfNotDry('git', ['tag', tag]);
  } else {
    console.log('No changes to commit.');
    return;
  }

  if (autoPushToGithub) {
    await pushToGithub(tag);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
