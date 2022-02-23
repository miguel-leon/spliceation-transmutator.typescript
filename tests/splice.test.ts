import { Extraction } from '@src/extract';
import { splice, Transmuter } from '@src/splice';

describe('Splice function', () => {

	describe('reconstitutes a string while transmuting extracted segments', () => {
		const transmuter: Transmuter =
			(_class: string, content: string) =>
				`<${ _class }>${ content }</${ _class }>`;

		test('with single level extractions', () => {
			const extraction: Extraction = {
				segments: [
					{
						segments: ['A'],
						class: 'a'
					},
					'-',
					{
						segments: ['B'],
						class: 'b'
					}
				]
			};

			const result = splice(extraction, transmuter);

			expect(result).toBe('<a>A</a>-<b>B</b>');
		});

		test('with multiple level extractions and line breaks', () => {
			const extraction: Extraction = {
				segments: [
					{
						segments: [
							'A',
							{
								segments: [
									{
										segments: ['C'],
										class: 'c'
									},
									'B'
								],
								class: 'b'
							}
						],
						class: 'a'
					},
					'\n\n',
					{
						segments: [
							{
								segments: ['B'],
								class: 'b'
							},
							'A'
						],
						class: 'a'
					}
				]
			};

			const result = splice(extraction, transmuter);

			expect(result).toBe('<a>A<b><c>C</c>B</b></a>\n\n<a><b>B</b>A</a>');
		});
	});
});
