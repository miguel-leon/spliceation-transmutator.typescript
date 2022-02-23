import { Transmutation } from '@src/transmutation';


describe('Transmutation class', () => {

	test('applies transmutation', () => {
		const transmutation = new Transmutation(
			[
				{
					match: /\bconst\b/g,
					class: 'key'
				},
				{
					match: /\b\d+\b/g,
					class: 'number'
				}
			],
			(_class: string, content: string) =>
				`<${ _class }>${ content }</${ _class }>`
		);

		const result = transmutation.apply('const X = 99;');

		expect(result).toBe('<key>const</key> X = <number>99</number>;');
	});
});
