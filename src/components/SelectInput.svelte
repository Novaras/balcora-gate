<script lang="ts">
	// TODO: the <label> should be used for the placeholder, and move up on input (ala floatlabeltextinput)
	// otherwise the <select> has no <label> until we already provided input - bad!

	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let options: {
		display: string,
		value: any,
		parse?: (html_val: string) => any,
		id: number | string
	}[];
	export let selected: any;
	export let value: any;
	export let allow_empty: boolean = true;
	export let block: boolean = false;
	export let width: string = `w-64`;
	export let name: string = ``;
	export let label: string = ``;
	export let invalid: string | null = null;
	export let hide_if_invalid: boolean = false;
	export let label_colour_class: string = `text-balc-blue`;

	$: has_value = (value !== undefined && value !== null);

	if (!has_value && allow_empty) {
		options = [
			{
				id: -1,
				display: label,
				value: null,
			},
			...options,
		];
	}


	selected = (value !== undefined && value !== null) ? options.find(opt => opt.value === value) : options[0];

	const doThing = (ev: Event) => {
		const target = ev.target as HTMLSelectElement;
		const opt = options.find(opt => opt.id === parseInt(target.selectedOptions[0].id));
		const parse = opt.parse ?? (v => v);
		selected = opt;
		value = parse(target.value);
		dispatch(`selected`, selected);
	};


	const final_options = (!has_value && allow_empty) ? options.slice(1) : options;

	let root_el: HTMLDivElement;
	let label_el: HTMLLabelElement;

	// hack to ensure float labels have correct bg colour (same as closest parent with a set bg colour)
	const updateLabelBg = async () => {
		const empty_bg_val = `rgba(0,0,0,0)`;
		const findNearestWithBg = (el: HTMLElement) => {
			const bg_colour = window.getComputedStyle(el).backgroundColor;
			if (bg_colour && bg_colour.toLowerCase().replace(/\s/g, ``) !== empty_bg_val) return bg_colour;
			if (el.tagName === `BODY`) return `transparent`;
			return findNearestWithBg(el.parentElement);
		};
		await new Promise<void>(res => setInterval(() => {
			const body_bg = window.getComputedStyle(document.querySelector(`body`)).backgroundColor;
			if (body_bg && body_bg.toLowerCase().replace(/\s/g, ``) !== empty_bg_val) res();
		}, 50));
		const bg_colour = findNearestWithBg(root_el);
		label_el.style.backgroundColor = bg_colour;
	};

	onMount(() => {
		updateLabelBg();
		new MutationObserver(updateLabelBg).observe(document.querySelector(`body`), {
			attributeFilter: [`class`]
		});
	});

	$: is_invalid = invalid && invalid.length;
	$: input_ring_classes = (() => {
		const classes: string[] = [];
		if (has_value || is_invalid) classes.push(`ring-2`);

		if (is_invalid) classes.push(`ring-balc-orange`);
		else if (has_value) classes.push(`ring-balc-white-hl dark:ring-balc-gray-hl`);
		return classes.reduce((acc, class_str) => {
			return `${acc} ${class_str}`;
		}, ``);
	})();
</script>

{#if !(invalid && hide_if_invalid)}
	<div class="relative { block ? `flex` : `inline-flex` } flex-col {width} my-2" bind:this={root_el}>
		{#if label.length && has_value}
			<label for={name}
				   class="absolute left-2 transform -translate-y-1/2  px-1 text-sm font-bold {label_colour_class} z-10 transition-all"
				   bind:this={label_el}>
				{ label }
			</label>
		{/if}
		<div class="relative h-10">
			<select class="w-full h-full px-3 {true ? input_ring_classes : `text-balc-gray dark:text-balc-white text-opacity-75 dark:text-opacity-75`}"
					id={name}
					on:input={doThing}>
				{#if !has_value && allow_empty} <!-- here we hide the initial empty option -->
					<option value={options[0]} hidden>
						{ options[0].display }...
					</option>
				{/if}
				{#each final_options as opt}
					<option value={opt.value} id={opt.id.toString()} selected={opt.id === selected.id}>
						{ opt.display }
					</option>
				{/each}
			</select>
			<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
				<svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
					<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
						fill-rule="evenodd" />
				</svg>
			</div>
		</div>
		{#if is_invalid}
			<div class="text-sm text-balc-orange mt-2">
				{ invalid }
			</div>
		{/if}
	</div>
{/if}
