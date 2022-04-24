import { regexp } from 'commonly.typescript/templates';
import { ForcePick } from '../util';
import { Clause } from '../clause';
import { Schema } from '../../schema';


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
	): ConstructorParameters<typeof SingleClause>[0] {
		return {
			pattern: Array.isArray(match) ?
				regexp.g`\b(?:${ match.join('|') })\b` :
				regexp.g.m(!!multiline)(match),
			class: class_,
			recursion: Array.isArray(recursion) ?
				recursion.map(Clause.parse) :
				!!recursion
		};
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
