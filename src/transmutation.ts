import { Schema } from './schema';
import { extract, ExtractOptions } from './extract';
import { splice, Transmuter } from './splice';
import { Clause } from './clause';
import { Catalog } from './clauses';


export class Transmutation {
	constructor(
		public readonly definition: Transmutation.Definition
	) {}

	apply(content: string, transmuter: Transmutation.Transmuter, options?: ExtractOptions): string {
		const extraction = extract(content, this.definition, options);
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
