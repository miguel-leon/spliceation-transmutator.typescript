import { Transmutation } from './transmutation';
import { prune } from 'commonly.typescript/objects';


type Segments = (string | Extraction)[];

export interface Extraction {
	segments: Segments;
	class?: string;
}

export type ExtractOptions = Partial<{
	splitOnLineBreaks: boolean;
	rootClass: string;
}>

export function extract(content: string, definition: Transmutation.Definition, options?: ExtractOptions): Extraction {
	options = { splitOnLineBreaks: true, ...options };

	return sweep([content], options.rootClass);

	function sweep(segments: Segments, _class?: string): Extraction {
		definition.forEach(clause => {
			segments = segments.flatMap(segment => typeof segment === 'string' ? applyClause(segment, clause) : segment);
		});

		return {
			segments,
			...prune({ class: _class })
		};
	}

	function applyClause(segment: string, clause: Transmutation.Clause): Extraction['segments'] {
		return [...segmentation()];

		function* segmentation(): Generator<Segments[number]> {
			let prev = 0;
			for (const { 0: match, index } of segment.matchAll(clause.match)) {
				if (prev < index!) yield segment.substring(prev, index);
				yield {
					segments: [match],
					class: clause.class
				};
				prev = index! + match.length;
			}
			if (prev < segment.length) yield segment.substring(prev);
		}
	}
}
