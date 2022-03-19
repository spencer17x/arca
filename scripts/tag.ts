import * as process from 'process';
import { getPackages, Package } from '@manypkg/get-packages';
// @ts-ignore
import prompts, { Choice } from 'prompts';
import { red } from 'kolorist';

function filterChoices(choices: Choice[], selectedChoices: Choice[]): Choice[] {
  return choices.filter(
    choice => selectedChoices.every(
      m => m.value.packageJson.name !== choice.value.packageJson.name
    )
  );
}

function packagesToChoices(packages: Package[]): Choice[] {
  return packages.map(pkg => ({
    title: pkg.packageJson.name,
    value: pkg,
  }));
}

async function main() {
  const { tool, root, packages } = await getPackages(process.cwd());

  let choices: Choice[] = packagesToChoices(packages.concat(root));

  const answer = await prompts(
    [
      {
        type: 'multiselect',
        name: 'major',
        instructions: false,
        message: 'Select packages to major version bump',
        choices
      },
      {
        type: choices.length ? 'multiselect' : null,
        name: 'minor',
        instructions: false,
        message: 'Select packages to minor version bump',
        choices: (selectedPackages) => {
          choices = filterChoices(choices, packagesToChoices(selectedPackages));
          return choices;
        }
      },
      {
        type: choices.length ? 'multiselect' : null,
        name: 'patch',
        instructions: false,
        message: 'Select packages to patch version bump',
        choices: (selectedPackages) => {
          choices = filterChoices(choices, packagesToChoices(selectedPackages));
          return choices;
        }
      },
      {
        type: choices.length ? 'multiselect' : null,
        name: 'beta',
        instructions: false,
        message: 'Select packages to beta version bump',
        choices: (selectedPackages) => {
          choices = filterChoices(choices, packagesToChoices(selectedPackages));
          return choices;
        }
      }
    ],
    {
      onCancel: () => {
        throw new Error(red('✖') + ' Operation cancelled');
      },
    },
  );

  console.log('answer', answer);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
