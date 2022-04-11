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
			Multiclause.parse(clause)
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
		}: Schema.Clause
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

	searchThrough(content: string): Iterable<Clause.Instance> {
		return this.occurrenceIterator(content);
	}

	private* occurrenceIterator(content: string): Generator<Clause.Instance> {
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

export class Multiclause implements Clause {
	static parse({ concurrent }: Schema.Multiclause) {
		return new Multiclause();
	}

	constructor() {
	}

	searchThrough(content: string): Iterable<Clause.Instance> {
		return this.occurrenceIterator(content);
	}

	private* occurrenceIterator(content: string): Generator<Clause.Instance> {
	}
}
