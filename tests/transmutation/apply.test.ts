import { Transmutation } from '@src/transmutation';
import { SingleClause } from '@src/clauses';


describe('Transmutation class', () => {

	test('applies transmutation', () => {
		const transmutation = new Transmutation(
			[
				new SingleClause({
					pattern: /\bconst\b/g,
					class: 'key',
					recursion: false
				}),
				new SingleClause({
					pattern: /\b\d+\b/g,
					class: 'number',
					recursion: false
				})
			],
			(_class: string, content: string) =>
				`<${ _class }>${ content }</${ _class }>`
		);

		const result = transmutation.apply('const X = 99;');

		expect(result).toBe('<key>const</key> X = <number>99</number>;');
	});
});
