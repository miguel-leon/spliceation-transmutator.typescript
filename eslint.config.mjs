// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';


export default tseslint.config(
	eslint.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				project: ['tsconfig.json', 'tsconfig.test.json'],
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		files: ['**/*.ts'],
		extends: [
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked
		],
		rules: {
			'@typescript-eslint/consistent-type-definitions': 'off', // type and interface can't be used interchangeably as the rule suggests, when dealing with index signatures.
			'@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
			'@typescript-eslint/no-explicit-any': 'off', // signature contravariance.
			'@typescript-eslint/no-namespace': 'off', // how to namespace things then?
			'@typescript-eslint/no-non-null-assertion': 'off', // unusable with noUncheckedIndexedAccess.
			'@typescript-eslint/prefer-function-type': 'off', // hinders readability.
			'@typescript-eslint/prefer-literal-enum-member': 'off', // nope!
			'@typescript-eslint/prefer-nullish-coalescing': ['error', { ignorePrimitives: true }],
			'@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }]
		}
	},
	{
		rules: {
			'no-sparse-arrays': 'off' // sparse arrays in use.
		}
	},
	stylistic.configs.customize({
		indent: 'tab',
		quotes: 'single',
		semi: true,
		braceStyle: '1tbs',
		commaDangle: 'only-multiline',
		jsx: false
	}),
	{
		rules: {
			'@stylistic/arrow-parens': ['error', 'as-needed'],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/max-statements-per-line': ['error', { ignoredNodes: ['ThrowStatement'] }],
			'@stylistic/no-mixed-operators': 'off',
			'@stylistic/no-multiple-empty-lines': ['error', { max: 2 }],
			'@stylistic/operator-linebreak': ['error', 'before', { overrides: { '?': 'after', ':': 'after', '??': 'after', '=': 'after' } }],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'avoidEscape' }],
			'@stylistic/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
			'@stylistic/template-curly-spacing': ['error', 'always']
		}
	},
	{
		files: ['tests/**'],
		rules: {}
	},
	{
		ignores: [
			'**',
			'!src/**',
			'!tests/**'
		]
	}
);
