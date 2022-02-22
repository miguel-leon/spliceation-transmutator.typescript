import { Extraction } from './extract';


export interface Transmuter {
	(_class: string, content: string): string;
}


export function splice(
	extraction: Extraction,
	transmuter: Transmuter
): string {
	return splicing(extraction);

	function splicing(extraction: Extraction) {
		extraction.segments = extraction.segments.map(
			segment => typeof segment === 'string' ? segment : splicing(segment)
		);
		return transmute(extraction);
	}

	function transmute(extraction: Extraction) {
		const content = extraction.segments.join('');
		return extraction.class ? transmuter(extraction.class, content) : content;
	}
}
