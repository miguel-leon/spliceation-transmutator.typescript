/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');

const tsjest = {
	tsconfig: 'tsconfig.test.json'
};

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	resolver: '<rootDir>/jest.resolver.js',
	globals: {
		'ts-jest': tsjest
	},
	moduleNameMapper: pathsToModuleNameMapper(require(`./${ tsjest.tsconfig }`).compilerOptions.paths, { prefix: '<rootDir>/' })
};
