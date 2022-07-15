# ar-changelog

Automate the workflow for generating Monorepo's changelog, which will ask you some questions to choose from and generate a changelog based on commits. You can also choose whether to automatically push to github by configuring ar-changelog.config.js.
## Install

```shell
$ pnpm add ar-changelog -D
```

if you don't install conventional-changelog-cli, you can install it by:

```shell
$ pnpm add conventional-changelog-cli -D
```

## Usage

### commands

#### release

**Feature**:

* Generate a changelog based on commits.
* Create a tag with package.

```shell
$ ar-changelog release
```

#### publish

It is mainly responsible for publishing package to NPM

```shell
$ ar-changelog publish <packageName>@tag
```

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


