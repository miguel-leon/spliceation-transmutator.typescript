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

				let last = 0, i = 0;
				do {
					if (typeof segments[i] === 'string') {
						if (clause.match.multiline && splitOnLineBreaks) {
							const splits = (segments[i] as string).split(/(\n+)/);

							if (splits.length > 1) {
								yield wrap([...segments.slice(last, i), ...[splits[0]].filter(Boolean)]);

								let j = 1;
								const n = splits.length - 2;
								while (j < n) {
									yield splits[j++];
									yield wrap([splits[j++]]);
								}
								yield splits[j++];
								if (splits[j]) {
									segments[i] = splits[j];
									last = i;
								} else {
									last = i + 1;
								}
							}
						}
					}
				} while (++i < segments.length);

				if (last < segments.length) {
					yield wrap(segments.slice(last));
				}

				prev = index! + match.length;
			}
			if (prev < segment.length) yield segment.substring(prev);

			function wrap(segments: Segments) {
				return {
					segments,
					class: clause.class
				};
			}
		}
	}
}
