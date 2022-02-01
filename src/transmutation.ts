import { regexp } from 'commonly.typescript/templates';
import { pick } from 'commonly.typescript/objects';


export namespace Transmutation {
	export type Definition = Clause[];

	export interface Clause {
		class: string;
		match: RegExp;
		multiline?: boolean;
		recursion?: boolean | Clause[];
	}

	// TODO: remove any
	export function fromJSON({ definition }: any): Definition {
		return definition.map((clause: any) => ({
			class: clause.class,
			match: Array.isArray(clause.match) ?
				regexp.g`\b(${ clause.match.join('|') })\b` :
				regexp.g.m(!!clause.multiline)(clause.match),

			...pick('recursion')(clause),
		}));
	}
}
