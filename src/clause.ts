import { Schema } from './schema';
import { MultiClause, SingleClause } from './clauses';


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

	export function parse(clause: Schema.Transmutation['definition'][number]): Clause {
		return 'match' in clause ?
			new SingleClause(SingleClause.parse(clause)) :
			new MultiClause(MultiClause.parse(clause));
	}
}
