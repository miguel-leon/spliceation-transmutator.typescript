import { Schema } from "../schema";
import { regexp } from 'commonly.typescript/templates';


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
			new SingleClause(clause) :
			new Multiclause(clause)
	}
}

export class SingleClause implements Clause {
	private readonly pattern: RegExp;
	private readonly class: string;
	private readonly recursion: boolean | Clause[];

	constructor(
		{
			class: class_,
			match,
			multiline,
			recursion
		}: Schema.Clause
	) {
		this.pattern = Array.isArray(match) ?
			regexp.g`\b(?:${ match.join('|') })\b` :
			regexp.g.m(!!multiline)(match);

		this.class = class_;

		if (Array.isArray(recursion)) {
			this.recursion = recursion.map(Clause.parse);
		} else {
			this.recursion = !!recursion;
		}
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
	constructor({ concurrent }: Schema.Multiclause) {
	}

	searchThrough(content: string): Iterable<Clause.Instance> {
		return this.occurrenceIterator(content);
	}

	private* occurrenceIterator(content: string): Generator<Clause.Instance> {
	}
}
