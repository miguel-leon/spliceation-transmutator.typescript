export interface Transmutation {
	$schema?: string;
	definition: Clause[];
	templates?: Record<string, SingleClause>;
}

export type Clause = SingleClause | MultiClause;

export interface SingleClause {
	extends?: string;
	match?: string | string[];
	class?: string;
	recursion?: boolean | Clause[];
	multiline?: boolean;
	ignoreCase?: boolean;
}

export interface MultiClause {
	concurrent: SingleClause[];
}
