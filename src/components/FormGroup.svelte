<script lang="ts">
	export let title: string = ``;
	export let block: boolean = true;
	export let width: string = `w-full`;
	export let h = 4;

	const header_classes = `absolute left-2 transform -translate-y-1/2 z-10 px-1 bg-balc-white dark:bg-balc-gray`;
	const header_html = `<h${h} class="${header_classes}">${title}</h${h}>`;

	$: block_class = block ? `flex` : `inline-flex`;
</script>

<div class="{ width } { block_class } flex-col items-center relative border border-balc-white-hl dark:border-balc-gray-hl mt-4">
	{#if title.length}
		{@html header_html}
	{/if}
	<div class="h-full w-full pb-4 pt-6 px-8">
		<slot></slot>
	</div>
</div>