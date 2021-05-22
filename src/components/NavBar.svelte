<script lang="ts">
	import DarkButton from "$components/DarkButton.svelte";
</script>

<nav class="sticky top-0 w-full border-b-2 border-balc-orange flex flex-row items-center p-2 z-20 bg-balc-white dark:bg-balc-gray">
	<div class="mr-2">
		<a href="/">
			<img src="images/balcora-logo-small.png" alt="home" class="h-14">
		</a>
	</div>
	<div class="ml-2 mr-auto">
		<ul class="flex flex-row items-center h-14 w-98 divide-x divide-balc-orange">
			<li class="px-10 flex justify-center">
				<a href="/">Home</a>
			</li>
			<li class="px-10 flex justify-center">
				<a href="lookup">Attribute Lookup</a>
			</li>
			<li class="px-10 flex justify-center">
				<a href="tools">Web Tools</a>
			</li>
			<li class="px-10 flex justify-center">
				<a class="text-balc-blue" href="https://github.com/HWRM/KarosGraveyard/wiki">Karos</a>
			</li>
		</ul>
	</div>
	<div class="flex-end">
		<DarkButton />
	</div>
</nav>
