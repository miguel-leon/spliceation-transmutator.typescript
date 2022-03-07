import { Transmutation } from '@src/transmutation';


describe('Definition from JSON', () => {

	describe('parses a JSON import', () => {

		test('with match as string regex', async () => {
			const jsonDef = await import('./def01.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toStrictEqual([{
				class: 'class1',
				match: /<.+>/g
			}]);
		});

		test('with match as array', async () => {
			const jsonDef = await import('./def02.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toStrictEqual([{
				class: 'class2',
				match: /\b(hello|goodbye)\b/g
			}]);
		});

		test('with recursion', async () => {
			const jsonDef = await import('./def03.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toStrictEqual([{
				class: 'outer',
				match: /'.*'/g,
				recursion: [
					{
						class: 'inner',
						match: /\d+/g,
						recursion: true
					}
				]
			}]);
		});

		test('with multiline', async () => {
			const jsonDef = await import('./def04.json');

			const def = Transmutation.fromJSON(jsonDef);

			expect(def).toStrictEqual([{
				class: 'multiline',
				match: /<#[^]*#>/gm
			}]);
		});
	});
});
