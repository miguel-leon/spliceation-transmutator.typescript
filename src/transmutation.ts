import { regexp } from 'commonly.typescript/templates';
import { pick } from 'commonly.typescript/objects';

import { extract } from './extract';
import { splice, Transmuter as _Transmuter } from './splice';


export class Transmutation {
	constructor(
		public readonly definition: Transmutation.Definition,
		public readonly transmuter: Transmutation.Transmuter
	) {}

	apply(content: string): string {
		const extraction = extract(content, this.definition);
		return splice(extraction, this.transmuter);
	}
}


export namespace Transmutation {
	export type Transmuter = _Transmuter;

	export type Definition = Clause[];

	export interface Clause {
		class: string;
		match: RegExp;
		recursion?: boolean | Definition;
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
