import { ArChangelogConfig } from './defaults';
/**
 * https://github.com/streamich/git-cz/blob/master/lib/getConfig.js
 * Get the config file
 * @param root
 */
export declare function findOverrides(root: string): ArChangelogConfig;
export declare function getConfig(root?: string): ArChangelogConfig;
