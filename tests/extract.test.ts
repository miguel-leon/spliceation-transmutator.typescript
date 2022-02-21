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

	test('splits the resulting segment into multiple when matching multiline', () => {
		const definition: Transmutation.Definition = [{
			match: /a\sa/gm,
			class: 'a'
		}];
		const content = 'bbba\nabbb';

		const result = extract(content, definition);

		expect(result).toEqual({
			segments: [
				'bbb',
				{ segments: ['a'], class: 'a' },
				'\n',
				{ segments: ['a'], class: 'a' },
				'bbb'
			]
		});
	});

	test('does recursive specification', () => {
		const definition: Transmutation.Definition = [{
			match: /a\S*a/g,
			class: 'a',
			recursion: [{
				match: /b.*?b/g,
				class: 'b',
				recursion: [{
					match: /c+/g,
					class: 'c'
				}]
			}]
		}];
		const content = 'aabccbaa aabcbcbbaa';

		const result = extract(content, definition);

		expect(result).toEqual({
			segments: [
				{
					class: 'a',
					segments: [
						'aa',
						{
							class: 'b',
							segments: [
								'b',
								{
									class: 'c',
									segments: ['cc']
								},
								'b'
							]
						},
						'aa'
					]
				},
				' ',
				{
					class: 'a',
					segments: [
						'aa',
						{
							class: 'b',
							segments: [
								'b',
								{
									class: 'c',
									segments: ['c']
								},
								'b'
							]
						},
						'c',
						{
							class: 'b',
							segments: ['bb']
						},
						'aa'
					]
				}
			]
		});
	});

	describe('does recursive specification with line breaks', () => {
		const definition: Transmutation.Definition = [{
			match: /`({({[^}]*}|[^}])*}|[^`])*`/gm,
			class: 's',
			recursion: [{
				match: /{({[^}]*}|`({[^}]*}|[^`])*`|[^}])*}/gm,
				class: 'i',
				recursion: true
			}]
		}];

		test('at top level clause', () => {
			const content = '`aa\n\na\n{`bbb`{`ccc`}}{`ddd`}\naaa`\n';

			const result = extract(content, definition);

			expect(result).toEqual({
				segments: [
					{
						class: 's',
						segments: ['`aa']
					},
					'\n\n',
					{
						class: 's',
						segments: ['a']
					},
					'\n',
					{
						class: 's',
						segments: [
							{
								class: 'i',
								segments: [
									'{',
									{
										class: 's',
										segments: ['`bbb`']
									},
									'{',
									{
										class: 's',
										segments: ['`ccc`']
									},
									'}}'
								]
							},
							{
								class: 'i',
								segments: [
									'{',
									{
										class: 's',
										segments: ['`ddd`']
									},
									'}'
								]
							}
						]
					},
					'\n',
					{
						class: 's',
						segments: ['aaa`']
					},
					'\n'
				]
			});
		});

		test('at any level clause', () => {
			const content = '`a\n{\n`b\nb`\n}\n{`{\n`c\nc`\n}`}\na`';

			const result = extract(content, definition);

			expect(result).toEqual({
				segments: [
					{
						class: 's',
						segments: ['`a']
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: ['{']
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: [{
								class: 's',
								segments: ['`b']
							}]
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: [{
								class: 's',
								segments: ['b`']
							}]
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: ['}']
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: [
								'{',
								{
									class: 's',
									segments: [
										'`',
										{
											class: 'i',
											segments: ['{']
										}
									]
								}
							]
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: [{
								class: 's',
								segments: [{
									class: 'i',
									segments: [{
										class: 's',
										segments: ['`c']
									}]
								}]
							}]
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: [{
								class: 's',
								segments: [{
									class: 'i',
									segments: [{
										class: 's',
										segments: ['c`']
									}]
								}]
							}]
						}]
					},
					'\n',
					{
						class: 's',
						segments: [{
							class: 'i',
							segments: [
								{
									class: 's',
									segments: [
										{
											class: 'i',
											segments: ['}']
										},
										'`'
									]
								},
								'}'
							]
						}]
					},
					'\n',
					{
						class: 's',
						segments: ['a`']
					}
				]
			});
		});
	});
});
