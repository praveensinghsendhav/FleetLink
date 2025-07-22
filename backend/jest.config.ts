import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

module.exports = {
  preset: 'ts-jest', // Use ts-jest preset for TypeScript
  testEnvironment: 'node', // Node.js environment for backend tests
  rootDir: '.', // Project root
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }), // Map aliases
  moduleFileExtensions: ['ts', 'js', 'json'], // Recognize these extensions
  testMatch: ['<rootDir>/tests/**/*.test.ts'], // Test files location
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './tests/views',
        filename: 'report.html',
        openReport: true,
      },
    ],
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }], // Move ts-jest config here
  },
};
