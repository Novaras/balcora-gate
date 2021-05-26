/// <reference types="@sveltejs/kit" />

declare module 'svelte-tabs';

// in-house types

declare interface SelectOpt<T> {
	display: string,
	value: T,
	parse?: (html_val: string) => T,
	id: number | string
}
