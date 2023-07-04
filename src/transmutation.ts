import { Schema } from './schema';
import { extract } from './extract';
import { splice, Transmuter } from './splice';
import { Clause } from './clause';
import { Catalog } from './clauses';


export class Transmutation {
	constructor(
		public readonly definition: Transmutation.Definition
	) {}

	apply(content: string, transmuter: Transmutation.Transmuter): string {
		const extraction = extract(content, this.definition);
		return splice(extraction, transmuter);
	}

	static fromJSON({ definition, templates }: Schema.Transmutation): Transmutation.Definition {
		const catalog = templates && new Catalog(templates);
		return definition.map(clause => Clause.parse(clause, catalog));
	}
}

export declare namespace Transmutation {
	export { Transmuter, Clause };
	export type Definition = Clause[];
}
