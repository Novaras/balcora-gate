<script lang="ts">

	export let href: string = `#`;
	export let bg_class: string = ``;
	export let title: string = ``;
	export let description: string = ``;
	let clazz: string = ``;
	export { clazz as class };

	let state: `hover` | `normal` = `normal`;
	const setState = (new_state: `hover` | `normal`) => {
		state = new_state;
	};
	
	// computed
	$: content_height = (state === `hover` ? `h-96` : `h-16`);
</script>

<a href="{href}" class="border border-opacity-40 border-balc-gray dark:border-gray-500 {bg_class} bg-cover bg-center bg-no-repeat {clazz}" on:mouseenter={() => state = `hover`} on:mouseleave={() => state = `normal`}>
	<div class="w-full bg-black bg-opacity-90 text-white flex flex-col justify-start items-center p-4 {content_height} transition-height duration-100">
		<h3 class="text-center text-3xl mb-3 whitespace-nowrap">
			{ title }
		</h3>
		{#if state === `hover`}
		<div class="w-3/4">
			<hr class="mb-8">
			{#if description.length}
				<p>
					{ description }
				</p>
			{:else}
				<slot></slot>
			{/if}
		</div>
		{/if}
	</div>
</a>