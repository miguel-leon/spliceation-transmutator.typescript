/**
 * Generated with https://transform.tools/json-schema-to-typescript
 */

/**
 * Transmutation clauses definition
 */
export interface Transmutation {
	$schema: string
	definition: Clause[]
}
export interface Clause {
	class: string
	match: string | string[]
	recursion?: boolean | Clause[]
	multiline?: boolean
}
