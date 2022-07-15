import { args, getPackageInfo, publishPackage, step, getConfig } from '../utils';

const MAIN_PACKAGE = getConfig().mainPackage;

export async function npmPublish() {
  const tag = args._[0];

  if (!tag) {
    throw new Error('No tag specified');
  }

  let pkgName = MAIN_PACKAGE;
  let version;

  if (tag.includes('@')) [pkgName, version] = tag.split('@');
  else version = tag;

  if (version.startsWith('v')) version = version.slice(1);

  const { currentVersion, pkgDir } = await getPackageInfo(pkgName);
  if (currentVersion !== version)
    throw new Error(
      `Package version from tag "${version}" mismatches with current version "${currentVersion}"`
    );

  step('Publishing package...');
  await publishPackage(pkgDir, version.includes('beta') ? 'beta' : undefined);
}
