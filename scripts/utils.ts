import colors from 'picocolors';

import { step, runIfNotDry, isDryRun } from './releaseUtils';

export * from './releaseUtils';

export async function pushToGithub(tag: string) {
  step('\nPushing to GitHub...');
  await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`]);
  await runIfNotDry('git', ['push']);

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`);
  } else {
    console.log(
      colors.green(
        '\nPushed, publishing should starts shortly on CI.\nhttps://github.com/vitejs/vite/actions/workflows/publish.yml'
      )
    );
  }

  console.log();
}
