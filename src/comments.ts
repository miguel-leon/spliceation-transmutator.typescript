import { Catalog } from './clauses';


export function handleRegExpComments(pattern: string, catalog?: Catalog, extends_?: string): string {
	return pattern.replaceAll(/\(\?#([^)]*)\)/g, (comment, tag: string, offset: number) => {
		const isRecursive = /^{(\d+)}$/.exec(tag);
		if (isRecursive) {
			const it = Number(isRecursive[1]);
			if (it > 1) {
				return handleRegExpComments(`${ pattern.substring(0, offset) }(?#{${ it - 1 }})${ pattern.substring(offset + comment.length) }`, catalog, extends_);
			}
		} else if (catalog) {
			const template = tag || extends_;
			const source = template && catalog.retrieve(template)?.pattern.source;
			if (source) return source;
		}
		return '';
	});
}
