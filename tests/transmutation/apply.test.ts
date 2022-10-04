import { Transmutation } from '@src/transmutation';
import { SingleClause } from '@src/clauses';


describe('Transmutation class', () => {

	test('applies transmutation', () => {
		const transmutation = new Transmutation(
			[
				new SingleClause({
					pattern: /\bconst\b/gi,
					class: 'key',
					recursion: false
				}),
				new SingleClause({
					pattern: /\b\d+\b/g,
					class: 'number',
					recursion: false
				})
			]
		);

		const result = transmutation.apply(
			'CONST X = 99;',
			(_class: string, content: string) => `<${ _class }>${ content }</${ _class }>`
		);

		expect(result).toBe('<key>CONST</key> X = <number>99</number>;');
	});
});
