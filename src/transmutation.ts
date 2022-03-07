import { regexp } from 'commonly.typescript/templates';
import { prune } from 'commonly.typescript/objects';

import { Schema } from '../schema';
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

	export function fromJSON({ definition }: Schema.Transmutation): Definition {
		return parse(definition);

		function parse(definition: Schema.Clause[]): Definition {
			return definition.map(clause => ({
				class: clause.class,
				match: Array.isArray(clause.match) ?
					regexp.g`\b(${ clause.match.join('|') })\b` :
					regexp.g.m(!!clause.multiline)(clause.match),

				...prune({
					recursion: Array.isArray(clause.recursion) ?
						parse(clause.recursion) :
						clause.recursion
				})
			}));
		}
	}
}
