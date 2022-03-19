import * as process from 'process';
import { getPackages, Package, Tool } from '@manypkg/get-packages';
// @ts-ignore
import prompts, { Choice } from 'prompts';
import { green, red } from 'kolorist';
import { run } from './utils';

type BumpVersionType = 'major' | 'minor' | 'patch' | 'beta' | 'alpha' | 'rc';

function filterChoices(choices: Choice[], selectedChoices: Choice[]): Choice[] {
  return choices.filter(
    choice => selectedChoices.every(
      m => m.value.packageJson.name !== choice.value.packageJson.name
    )
  );
}

function packagesToChoices(packages: Package[] = []): Choice[] {
  return packages.map(pkg => ({
    title: pkg.packageJson.name,
    value: pkg,
  }));
}

async function doBumpPackagesOfType(
  packageManager: Tool,
  bumpPackages: Map<BumpVersionType, Package[]>,
  bumpVersionType: BumpVersionType
) {
  const packages = bumpPackages.get(bumpVersionType) || [];
  if (packages.length) {
    console.log(
      green(`Bumping ${bumpVersionType} packages:`)
    );
    for (const pkg of packages) {
      const output = await run(
        packageManager,
        ['version', bumpVersionType],
        { cwd: pkg.dir, stdio: 'pipe' }
      );
      const nextVersion = output.stdout.replace('v', '');
      console.log(
        `${green(`${pkg.packageJson.name}`)}: v${pkg.packageJson.version} => v${nextVersion}`
      );
      // git add package.json
      await run(
        'git',
        ['add', 'package.json'],
        { cwd: pkg.dir }
      );
      // git commit -m "release(xxx): v1.0.0"
      await run(
        'git',
        ['commit', '-m', `release(${pkg.packageJson.name}): v${nextVersion}`],
        { cwd: pkg.dir }
      );
      // git tag
      await run(
        'git',
        ['tag', `${pkg.packageJson.name}@${nextVersion}`],
        { cwd: pkg.dir }
      )
    }
  }
}

async function doBumpPackages(packageManager: Tool, bumpPackages: Map<BumpVersionType, Package[]>) {
  console.log();
  console.log(green('Bumping all packages:'));
  console.log();
  await doBumpPackagesOfType(packageManager, bumpPackages, 'major');
  await doBumpPackagesOfType(packageManager, bumpPackages, 'minor');
  await doBumpPackagesOfType(packageManager, bumpPackages, 'patch');
  console.log();
}

async function main() {
  const { tool: packageManager, root, packages } = await getPackages(process.cwd());

  const choices: Choice[] = packagesToChoices(packages.concat(root));
  const bumpPackages = new Map<BumpVersionType, Package[]>();
  let selectedChoices: Choice[] = [];

  async function askBumpVersion(type: BumpVersionType): Promise<Choice[]> {
    const isFinishAsk = selectedChoices.length === choices.length;
    if (!isFinishAsk) {
      const { packages } = await prompts({
        type: 'multiselect',
        name: 'packages',
        instructions: false,
        message: `Select packages to ${type} version bump`,
        choices: filterChoices(choices, selectedChoices),
      }, {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      });
      bumpPackages.set(type, packages);
      return selectedChoices.concat(packagesToChoices(packages));
    }
    return selectedChoices;
  }

  selectedChoices = await askBumpVersion('major');
  selectedChoices = await askBumpVersion('minor');
  selectedChoices = await askBumpVersion('patch');

  await doBumpPackages(packageManager, bumpPackages);

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
