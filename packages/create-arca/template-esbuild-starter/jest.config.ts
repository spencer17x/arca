import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    transform: {
      '^.+\\.(t|j)sx?$': 'ts-jest'
    },
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: [
      'ts',
      'tsx',
      'js'
    ],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/test/'
    ],
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 95,
        lines: 95,
        statements: 95
      }
    },
    collectCoverageFrom: [
      'src/*.{js,ts}'
    ]
  }
};