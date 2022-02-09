import { Transmutation } from './transmutation';
import { prune } from 'commonly.typescript/objects';
import { intersperse } from 'commonly.typescript/arrays';


type Segments = (string | Extraction)[];

export interface Extraction {
	segments: Segments;
	class?: string;
}

export type ExtractOptions = Partial<{
	splitOnLineBreaks: boolean;
	rootClass: string;
}>

export function extract(
	content: string,
	definition: Transmutation.Definition,
	{ splitOnLineBreaks = true, rootClass }: ExtractOptions = {}
): Extraction {
	return {
		segments: sweep(definition, [content]),
		...prune({ class: rootClass })
	};

	function sweep(definition: Transmutation.Definition, segments: Segments): Segments {
		return definition.reduce(
			(segments, clause) =>
				segments.flatMap(segment => typeof segment === 'string' ? applyClause(segment, clause) : segment),
			segments
		);
	}

	function applyClause(segment: string, clause: Transmutation.Clause): Segments {
		return [...segmentation()];

		function* segmentation(): Generator<Segments[number]> {
			let prev = 0;
			for (const { 0: match, index } of segment.matchAll(clause.match)) {
				if (prev < index!) yield segment.substring(prev, index);

				const segments: Segments =
					clause.recursion ?
						sweep(
							Array.isArray(clause.recursion) ?
								clause.recursion :
								definition,
							[match]
						) :
						[match];

				const segmentSplits = (
					clause.match.multiline && splitOnLineBreaks ?
						splitLineBreaks(segments) :
						[segments]
				).map(segments => ({
					segments,
					class: clause.class
				}));

				for (const extraction of intersperse('\n')(segmentSplits)) {
					yield extraction;
				}

				prev = index! + match.length;
			}
			if (prev < segment.length) yield segment.substring(prev);
		}
	}

	function splitLineBreaks(segments: Segments): Segments[] {
		return segments.flatMap(
			segment => typeof segment === 'string' ?
				segment.split('\n').map(split => [split] as Segments) :
				[segment]
		);
	}
}
