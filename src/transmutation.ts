import { Schema } from '../schema';
import { extract } from './extract';
import { splice, Transmuter as _Transmuter } from './splice';
import { Clause as _Clause } from './clause';


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

	export type Clause = _Clause;

	export type Definition = Clause[];

	export function fromJSON({ definition }: Schema.Transmutation): Definition {
		return parse(definition);

		function parse(definition: Schema.Transmutation['definition']): Definition {
			return definition.map(_Clause.parse);
		}
	}
}
