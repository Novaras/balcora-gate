<script lang="ts">
	// note we always keep the input as a 'text', since there is no way on firefox to remove the number input 'spin wheel'
	// regardless, we only allow float-parsable input if 'type' is 'number'
	export let value: string | number;
	export let label = ``;
	export let type: `text` | `number` = `text`;
	export let block = false;
	export let width = `w-64`;
	export let name = ``;
	export let min = 0;
	export let max = Infinity;
	export let invalid: string | null = null;
	export let hide_if_invalid: boolean = false;

	let focused = false;

	const setFocused = (focus: boolean) => {
		focused = focus;
	};

	const handleInput: svelte.JSX.FormEventHandler<HTMLInputElement> = (ev) => {
		const target = ev.currentTarget;
		switch (type) {
			case `number`:
				const as_num = Number(target.value);
				if (isNaN(as_num) || as_num < min || as_num > max) { // if bad numeric input, just reset to last good value
					target.value = value.toString();
					return;
				}
				value = as_num;
				break;
			case `text`:
				value = target.value;
				break;
		}
	}

	$: filled = (value !== undefined && value !== null);
	if (filled) value = value.toString(); // on init, convert any passed values to string

	$: focused_or_filled = (focused || filled);
	$: label_pos_classes = focused_or_filled
		? `-translate-y-1/2 px-1 z-10 bg-balc-white dark:bg-balc-gray text-sm text-balc-blue font-bold whitespace-nowrap`
		: `w-full h-full bg-transparent flex items-center px-3 text-balc-gray dark:text-balc-white text-opacity-75 dark:text-opacity-75 cursor-pointer`;
	$: label_append = focused_or_filled ? (focused ? ` (${type})` : ``) : `...`;
	$: is_invalid = (invalid && invalid.length);
	$: input_ring_classes = (() => {
		const classes: string[] = [];
		if (filled || is_invalid) classes.push(`ring-2`);

		if (is_invalid) classes.push(`ring-balc-orange`);
		else if (filled) classes.push(`ring-balc-white-hl dark:ring-balc-gray-hl`);
		return classes.reduce((acc, class_str) => {
			return `${acc} ${class_str}`;
		}, ``);
	})();
</script>

{#if !(invalid && hide_if_invalid)}
	<div class="{width}">
		<div class="relative my-2 h-10 {block ? `block` : `inline-block`} w-full">
			<label for={name}
				class="absolute left-2 transform {label_pos_classes} transition-all">
				{label}{label_append}
			</label>
			<input value={value ?? ``}
				id={name}
				type="text"
				class="h-full w-full rounded-sm px-3 {input_ring_classes}"
				min={min}
				max={max}
				on:change={handleInput}
				on:focus={() => setFocused(true)}
				on:blur={() => setFocused(false)}>
		</div>
		{#if is_invalid}
			<div class="text-sm text-balc-orange w-full">
				{ invalid }
			</div>
		{/if}
	</div>
{/if}
