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
						]
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
										recursion: false
									},
									{
										class: 'B',
										multiline: false,
										recursion: false
									}
								]
							}
						]
					},
					{
						class: 'symbol',
						multiline: false,
						recursion: false
					}
				]
			}]);
		});
	});
});
