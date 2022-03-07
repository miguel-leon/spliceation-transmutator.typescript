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
			return definition.map(
				({
					class: _class,
					match,
					multiline,
					recursion
				}) => ({
					class: _class,
					match: Array.isArray(match) ?
						regexp.g`\b(${ match.join('|') })\b` :
						regexp.g.m(!!multiline)(match),

					...prune({
						recursion: Array.isArray(recursion) ?
							parse(recursion) :
							recursion
					})
				})
			);
		}
	}
}
