export type ForcePick<T extends { [k: string]: any }, K extends string> = {
	[k in K]: T[k];
}
