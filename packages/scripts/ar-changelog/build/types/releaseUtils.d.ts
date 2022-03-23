import type { Options as ExecaOptions } from 'execa';
import execa from 'execa';
import type { ReleaseType } from 'semver';
export declare const args: any;
export declare const isDryRun: boolean;
export declare const packages: string[];
export declare const versionIncrements: ReleaseType[];
export declare function getPackageInfo(pkgName: string): {
    pkg: {
        name: string;
        version: string;
        private?: boolean | undefined;
    };
    pkgName: string;
    pkgDir: string;
    pkgPath: string;
    currentVersion: string;
};
export declare function run(bin: string, args: string[], opts?: ExecaOptions<string>): Promise<execa.ExecaReturnValue<string>>;
export declare function dryRun(bin: string, args: string[], opts?: ExecaOptions<string>): Promise<void>;
export declare const runIfNotDry: typeof dryRun | typeof run;
export declare function step(msg: string): void;
export declare function getVersionChoices(currentVersion: string): {
    title: string;
    value: string;
}[];
export declare function updateVersion(pkgPath: string, version: string): void;
export declare function publishPackage(pkdDir: string, tag?: string): Promise<void>;
export declare function getLatestTag(pkgName: string): Promise<string>;
export declare function logRecentCommits(pkgName: string): Promise<void>;
export declare function updateTemplateVersions(): Promise<void>;
