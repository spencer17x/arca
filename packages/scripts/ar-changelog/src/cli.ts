import { Command } from 'commander';

import { release, npmPublish } from './commands';

const program = new Command();

program
  .version(VERSION, '-v, --version', 'output the version number');

program
  .command('release')
  .description('Release a package')
  .action(() => {
    release().catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });

program.command('publish')
  .argument('<tag>', 'The tag to publish to')
  .description('Publish a package to npm')
  .action((tag) => {
    npmPublish(tag).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });

program.parse();
