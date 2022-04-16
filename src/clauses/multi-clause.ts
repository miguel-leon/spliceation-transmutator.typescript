import { regexp } from 'commonly.typescript/templates';
import { ForcePick } from '../util';
import { Clause } from '../clause';
import { Schema } from '../../schema';


export class MultiClause implements Clause {
	private readonly pattern!: RegExp;
	private readonly clauses!: {
		class: string,
		multiline: boolean,
		recursion: boolean | Clause[]
	}[];

	static parse({ concurrent }: Schema.MultiClause, ClauseClass = MultiClause) {
		return new ClauseClass({
			pattern: regexp.g.m(concurrent.some(({ multiline }) => multiline))(
				concurrent
					.map(
						({ match }) => Array.isArray(match) ?
							String.raw`\b(?:${ match.join('|') })\b` :
							match
					)
					.map(pattern => `(${ pattern })`)
					.join('|')
			),
			clauses: concurrent.map(
				({
					class: class_,
					multiline,
					recursion
				}) => ({
					class: class_,
					multiline: !!multiline,
					recursion: Array.isArray(recursion) ?
						recursion.map(Clause.parse) :
						!!recursion
				})
			)
		});
	}

	constructor(properties: ForcePick<MultiClause, 'pattern' | 'clauses'>) {
		Object.assign(this, properties);
	}

	* searchThrough(content: string): Iterable<Clause.Instance> {
		for (const result of content.matchAll(this.pattern)) {
			const [match, ...groups] = result;
			yield {
				match,
				index: result.index!,
				...this.clauses[groups.findIndex(capture => capture === match)]
			};
		}
	}
}
