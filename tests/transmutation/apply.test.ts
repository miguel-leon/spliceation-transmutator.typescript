import { Transmutation } from '@src/transmutation';
import { SingleClause } from '@src/clause';


describe('Transmutation class', () => {

	test('applies transmutation', () => {
		const transmutation = new Transmutation(
			[
				new SingleClause({
					match: ['const'],
					class: 'key'
				}),
				new SingleClause({
					match: '\\b\\d+\\b',
					class: 'number'
				})
			],
			(_class: string, content: string) =>
				`<${ _class }>${ content }</${ _class }>`
		);

		const result = transmutation.apply('const X = 99;');

		expect(result).toBe('<key>const</key> X = <number>99</number>;');
	});
});
