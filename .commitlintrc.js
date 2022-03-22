const config = require('./changelog.config');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  'type-enum': config.list,
};
