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

	});
});
