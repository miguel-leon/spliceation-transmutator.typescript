import { Schema } from './schema';
import { Catalog, MultiClause, SingleClause } from './clauses';


export interface Clause {
	searchThrough(content: string): Iterable<Clause.Instance>;
}

export namespace Clause {
	export interface Instance {
		match: string;
		index: number;
		class?: string;
		multiline: boolean;
		recursion: boolean | Clause[];
	}

	export function parse(clause: Schema.Clause, catalog?: Catalog): Clause {
		return 'concurrent' in clause ?
			new MultiClause(MultiClause.parse(clause, catalog)) :
			new SingleClause(SingleClause.parse(clause, catalog));
	}
}
