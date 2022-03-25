# ar-changelog

Automate the workflow for generating Monorepo's changelog, which will ask you some questions to choose from and generate a changelog based on commits. You can also choose whether to automatically push to github by configuring ar-changelog.config.js.
## Install

```shell
$ pnpm add ar-changelog -D
```

## Usage

* add ar-changelog script to your package.json scripts
* run `pnpm run ar-changelog`

## Custom config

You can provide a custom configuration in a ar-changelog.config.js file in your repo, or in any parent folder. ar-changelog will search for the closest config file. Below is default config:

```js
module.exports = {
  // main package, it will generate tag like v1.0.0
  mainPackage: '',
  // whether to automatically push to github
  autoPushToGithub: false
}
```


