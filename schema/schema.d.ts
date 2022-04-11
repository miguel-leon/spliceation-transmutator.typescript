/**
 * Generated with https://transform.tools/json-schema-to-typescript
 */

export type Clause = SingleClause | MultiClause

/**
 * Transmutation clauses definition
 */
export interface Transmutation {
	$schema: string
	definition: Clause[]
}
export interface SingleClause {
	class: string
	match: string | string[]
	recursion?: boolean | Clause[]
	multiline?: boolean
}
export interface MultiClause {
	concurrent: SingleClause[]
}
