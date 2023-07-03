import { regexp } from 'commonly.typescript/templates';
import { Schema } from '../schema';
import { ForcePick } from '../util';
import { Clause } from '../clause';


export type SingleClauseAttributes = ForcePick<SingleClause, 'pattern' | 'class' | 'recursion'>;

export class SingleClause implements Clause {
	private readonly pattern!: RegExp;
	private readonly class?: string;
	private readonly recursion!: boolean | Clause[];

	static parse(
		{ extends: extends_, recursion, ...args }: Schema.SingleClause,
		catalog?: Catalog
	): SingleClauseAttributes {
		const base = extends_ && catalog?.retrieve(extends_) || undefined;
		const {
			match = base!.pattern.source,
			class: class_ = base?.class,
			multiline = base?.pattern.multiline,
			ignoreCase = base?.pattern.ignoreCase
		} = args;

		return {
			pattern: Array.isArray(match) ?
				regexp.g.i(!!ignoreCase)`\b(?:${ match.join('|') })\b` :
				regexp.g.i(!!ignoreCase).m(!!multiline)(match),
			class: class_,
			recursion: Array.isArray(recursion) ?
				recursion.map(clause => Clause.parse(clause, catalog)) :
				recursion ?? base?.recursion ?? false
		};
	}

	constructor(properties: SingleClauseAttributes) {
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


export class Catalog {
	constructor(private templates: Record<string, Schema.SingleClause>) {}

	private entries = new Map<string, SingleClauseAttributes>();

	retrieve(name: string): Readonly<SingleClauseAttributes> | undefined {
		let entry = this.entries.get(name);
		if (!entry && this.templates[name]) {
			entry = SingleClause.parse(this.templates[name], this);
			this.entries.set(name, entry);
		}
		return entry;
	}
}
