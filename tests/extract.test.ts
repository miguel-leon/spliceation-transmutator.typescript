import { Transmutation } from '@src/transmutation';
import { extract } from '@src/extract';


describe('Extract function', () => {

	test('creates a Extraction from a Definition with single clause', () => {
		const definition: Transmutation.Definition = [{
			match: /a/g,
			class: 'a'
		}];
		const content = 'abcabc';

		const result = extract(content, definition);

		expect(result).toEqual({
			segments: [
				{ segments: ['a'], class: 'a' },
				'bc',
				{ segments: ['a'], class: 'a' },
				'bc'
			]
		});
	});

	test('creates a Extraction from a Definition with multiple clauses', () => {
		const definition: Transmutation.Definition = [{
			match: /a/g,
			class: 'a'
		}, {
			match: /c/g,
			class: 'c'
		}];
		const content = 'abcabc';

		const result = extract(content, definition);

		expect(result).toEqual({
			segments: [
				{ segments: ['a'], class: 'a' },
				'b',
				{ segments: ['c'], class: 'c' },
				{ segments: ['a'], class: 'a' },
				'b',
				{ segments: ['c'], class: 'c' }
			]
		});
	});

	test('add a root class when specified in options', () => {
		const result = extract('', [], { rootClass: 'root' });

		expect(result).toEqual({
			segments: [''],
			class: 'root'
		});
	});
});
