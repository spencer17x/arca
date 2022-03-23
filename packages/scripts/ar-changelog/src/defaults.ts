export interface ArChangelogConfig {
  mainPackage: string,
  autoPushToGithub: boolean,
}

export const defaultArChangelogConfig: ArChangelogConfig = {
  mainPackage: '',
  autoPushToGithub: false
};
