export type ForcePick<T extends Record<string, any>, K extends string> = {
	[k in K]: T[k];
};
