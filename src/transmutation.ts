import { Schema } from './schema';
import { extract } from './extract';
import { splice, Transmuter as _Transmuter } from './splice';
import { Clause as _Clause } from './clause';
import { Catalog } from './clauses';


export class Transmutation {
	constructor(
		public readonly definition: Transmutation.Definition
	) {}

	apply(content: string, transmuter: Transmutation.Transmuter): string {
		const extraction = extract(content, this.definition);
		return splice(extraction, transmuter);
	}
}

export namespace Transmutation {
	export type Transmuter = _Transmuter;

	export type Clause = _Clause;

	export type Definition = Clause[];

	export function fromJSON({ definition, templates }: Schema.Transmutation): Definition {
		const catalog = templates && new Catalog(templates);
		return definition.map(clause => _Clause.parse(clause, catalog));
	}
}
