import { regexp } from 'commonly.typescript/templates';
import { Schema } from "../schema";
import { ForcePick } from './util';


export interface Clause {
	searchThrough(content: string): Iterable<Clause.Instance>;
}

export namespace Clause {
	export interface Instance {
		match: string;
		index: number;
		class: string;
		multiline: boolean;
		recursion: boolean | Clause[];
	}

	export function parse(clause: Schema.Transmutation['definition'][number]): Clause {
		return 'match' in clause ?
			SingleClause.parse(clause) :
			MultiClause.parse(clause)
	}
}

export class SingleClause implements Clause {
	private readonly pattern!: RegExp;
	private readonly class!: string;
	private readonly recursion!: boolean | Clause[];

	static parse(
		{
			class: class_,
			match,
			multiline,
			recursion
		}: Schema.SingleClause
	) {
		return new SingleClause({
			pattern: Array.isArray(match) ?
				regexp.g`\b(?:${ match.join('|') })\b` :
				regexp.g.m(!!multiline)(match),
			class: class_,
			recursion: Array.isArray(recursion) ?
				recursion.map(Clause.parse) :
				!!recursion
		});
	}

	constructor(properties: ForcePick<SingleClause, 'pattern' | 'class' | 'recursion'>) {
		Object.assign(this, properties);
	}

	* searchThrough(content: string): Iterable<Clause.Instance> {
		for (const { 0: match, index } of content.matchAll(this.pattern)) {
			yield {
				match,
				index: index!,
				class: this.class,
				multiline: this.pattern.multiline,
				recursion: this.recursion
			};
		}
	}
}

export class MultiClause implements Clause {
	private readonly pattern!: RegExp;
	private readonly clauses!: {
		class: string,
		multiline: boolean,
		recursion: boolean | Clause[]
	}[];

	static parse({ concurrent }: Schema.MultiClause) {
		return new MultiClause({
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
