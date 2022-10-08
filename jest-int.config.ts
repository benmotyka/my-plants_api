/* eslint-disable */
export default {
    rootDir: './',
    preset: 'ts-jest',
    testRegex: ".int-spec.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
      "@modules/(.*)$": "<rootDir>/src/modules/$1",
      "@guards/(.*)$": "<rootDir>/src/guards/$1",
      "@util/(.*)$": "<rootDir>/src/util/$1",
      "@decorators/(.*)$": "<rootDir>/src/decorators/$1",
      "@enums/(.*)$": "<rootDir>/src/enums/$1",
      "@shared/(.*)$": "<rootDir>/src/shared/$1"
    },
  };
  