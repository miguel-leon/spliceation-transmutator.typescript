import { regexp } from 'commonly.typescript/templates';
import { Schema } from '../schema';
import { Clause } from '../clause';
import { SingleClause } from './single-clause';


export class MultiClause implements Clause {
	private readonly pattern: RegExp;
	private readonly clauses: {
		class: string,
		multiline: boolean,
		recursion: boolean | Clause[],
		capturingGroupIndex: number
	}[];

	static parse({ concurrent }: Schema.MultiClause): ConstructorParameters<typeof MultiClause>[0] {
		return concurrent.map(SingleClause.parse);
	}

	constructor(clauses: ConstructorParameters<typeof SingleClause>[0][]) {
		let nextIndex = 1;
		let currentIndex: number;
		this.clauses = clauses.map(
			({
				pattern,
				class: class_,
				recursion
			}) => ({
				class: class_,
				multiline: pattern.multiline,
				recursion,
				capturingGroupIndex: (
					currentIndex = nextIndex,
					nextIndex += numberOfMatchingGroups(pattern),
					currentIndex
				)
			})
		);
		this.pattern = regexp.g
			.i(clauses.some(({ pattern }) => pattern.ignoreCase))
			.m(clauses.some(({ pattern }) => pattern.multiline))(
			clauses
				.map(({ pattern }, i) => `(${ adjustBackReferences(pattern.source, this.clauses[i].capturingGroupIndex) })`)
				.join('|')
		);
	}

	* searchThrough(content: string): Iterable<Clause.Instance> {
		for (const result of content.matchAll(this.pattern)) {
			yield {
				match: result[0],
				index: result.index!,
				...this.matchingClause(result)
			};
		}
	}

	private matchingClause(result: string[]) {
		for (const {
			class: class_,
			multiline,
			recursion,
			capturingGroupIndex
		} of this.clauses) {
			if (result[0] === result[capturingGroupIndex]) return {
				class: class_,
				multiline,
				recursion,
			};
		}
		throw new Error('Unmatched Clause');
	}
}

function numberOfMatchingGroups(re: RegExp) {
	return regexp`^|${ re.source }`.exec('')!.length;
}

function adjustBackReferences(source: string, groupsBehind: number) {
	return source.replaceAll(/((?<!\\)(?:\\\\)*\\)(\d+)/g, (_, p1, p2) => `${ p1 }${ Number(p2) + groupsBehind }`);
}
