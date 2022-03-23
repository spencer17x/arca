import path from 'path';
import * as fs from 'fs';
import signale from 'signale';

import { ArChangelogConfig } from './defaults';

const configFiles = [
  'ar-changelog.config.js',
];

/**
 * https://github.com/streamich/git-cz/blob/master/lib/getConfig.js
 * Get the config file
 * @param root
 */
export function findOverrides(root: string): ArChangelogConfig {
  const dir = root || process.cwd();

  for (const file of configFiles) {
    const filename = path.resolve(dir, file);

    if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
      return require(filename);
    }
  }

  const parent = path.resolve(dir, '..');

  if (parent !== dir) {
    return findOverrides(parent);
  }

  const pkgFilename = path.join(dir, 'package.json');

  if (fs.existsSync(pkgFilename)) {
    try {
      const changelog = require(pkgFilename).config.commitizen.changelog;

      if (changelog) {
        return changelog;
      }
    } catch (error) {
    }
  }

  return {
    mainPackage: '',
    autoPushToGithub: false
  };
}

export function getConfig(root?: string) {
  const overrides = findOverrides(root || process.cwd());

  if (typeof overrides !== 'object') {
    signale.fatal(new TypeError('Expected changelog config to be an object.'));

    process.exit(1);
  }

  return overrides;
}
