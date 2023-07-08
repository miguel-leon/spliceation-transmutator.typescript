import { Transmutation } from '@src/transmutation';


describe('Definition from JSON', () => {

	describe('parses a JSON import', () => {

		test('with match as string regex', async () => {
			const jsonDef = await import('./def01.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: 'class1',
				pattern: /<.+>/g,
				recursion: false
			}]);
		});

		test('with match as array', async () => {
			const jsonDef = await import('./def02.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: 'class2',
				pattern: /\b(?:hello|goodbye)\b/g,
				recursion: false
			}]);
		});

		test('with recursion', async () => {
			const jsonDef = await import('./def03.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: 'outer',
				pattern: /'.*'/g,
				recursion: [
					{
						class: 'inner',
						pattern: /\d+/g,
						recursion: true
					}
				]
			}]);
		});

		test('with multiline', async () => {
			const jsonDef = await import('./def04.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: 'multiline',
				pattern: /<#[^]*#>/gm,
				recursion: false
			}]);
		});

		test('with concurrent clauses and recursion', async () => {
			const jsonDef = await import('./def05.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				pattern: /('.*?')|(<#[^]*#>)|(\b(?::|;)\b)/gm,
				clauses: [
					{
						class: 'string',
						multiline: false,
						recursion: [
							{
								class: 'X',
								pattern: /X/g,
								recursion: false
							}
						],
						capturingGroupIndex: 1
					},
					{
						class: 'comment',
						multiline: true,
						recursion: [
							{
								pattern: /(A)|(B)/g,
								clauses: [
									{
										class: 'A',
										multiline: false,
										recursion: false,
										capturingGroupIndex: 1
									},
									{
										class: 'B',
										multiline: false,
										recursion: false,
										capturingGroupIndex: 2
									}
								]
							}
						],
						capturingGroupIndex: 2
					},
					{
						class: 'symbol',
						multiline: false,
						recursion: false,
						capturingGroupIndex: 3
					}
				]
			}]);
		});

		test('with concurrent clauses using capturing groups adjusting numeric back references', async () => {
			const jsonDef = await import('./def06.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				pattern: /((?<q>["'])(.)\3\k<q>)|(([-~])(\d)\6\5\\69)/g,
				clauses: [
					{
						class: 'quote',
						multiline: false,
						recursion: false,
						capturingGroupIndex: 1
					},
					{
						class: 'dash',
						multiline: false,
						recursion: false,
						capturingGroupIndex: 4
					}
				]
			}]);
		});

		test('with case insensitive string regex and array', async () => {
			const jsonDef = await import('./def07.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: 'class1',
				pattern: /\becho(?=\s*["'])/gi,
				recursion: false
			}, {
				class: 'class2',
				pattern: /\b(?:function|procedure)\b/gi,
				recursion: false
			}, {
				pattern: /(xxx)/gi,
				clauses: [{
					class: 'class3',
					capturingGroupIndex: 1,
					multiline: false,
					recursion: false
				}]
			}]);
		});

		test('with reusable templates', async () => {
			const jsonDef = await import('./def08.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: 'reusable',
				pattern: /rematch/gi,
				recursion: false
			}, {
				class: 'reusable',
				pattern: /reusable match/gmi,
				recursion: [
					{
						class: 'reusable-within',
						pattern: /reusable recursive match/gi,
						recursion: true
					}
				]
			}]);
		});

		test('with ill-defined templates', async () => {
			expect(() => {
				Transmutation.fromJSON({
					definition: [{
						extends: 'does-not-exists'
						// no "match" attribute
					}]
				});
			}).toThrow(TypeError);

			expect(() => {
				Transmutation.fromJSON({
					definition: [{
						extends: 'circular-a'
					}],
					templates: {
						'circular-a': {
							extends: 'circular-b'
						},
						'circular-b': {
							extends: 'circular-a'
						}
					}
				});
			}).toThrow(RangeError);
		});

		test('with regular expression comment syntax and special comment features', async () => {
			const jsonDef = await import('./def09.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toEqual([{
				class: undefined,
				pattern: /comments removed --><--/g,
				recursion: false
			}, {
				class: 'braces',
				pattern: /{(?:{(?:{(?:{(?:{(?:{(?:{(?:{(?:|[^}])*}|[^}])*}|[^}])*}|[^}])*}|[^}])*}|[^}])*}|[^}])*}|[^}])*}/g,
				recursion: false
			}, {
				class: undefined,
				pattern: /insert->\((?:\((?:|[^)])*\)|[^)])*\)<-/g,
				recursion: false
			}, {
				class: undefined,
				pattern: /@[\w-]+[^;{]*(?=[{;])/g,
				recursion: [{
					class: 'identifier',
					pattern: /^@[\w-]+/g,
					recursion: false
				}]
			}, {
				class: undefined,
				pattern: /is up<is up<><is up<><>>><is up<is up<><>><>>/g,
				recursion: false
			}]);
		});
	});
});
