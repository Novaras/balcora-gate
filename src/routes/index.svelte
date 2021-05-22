<script>
	import Banner from "$components/Banner.svelte";
	// cmp
	import ImageLink from '$components/ImageLink.svelte';
</script>

<Banner />
<section class="mx-4 lg:mx-40 grid grid-flow-col grid-rows-3 xl:grid-rows-1 xl:grid-cols-3 gap-6 pb-24">
	<ImageLink href="https://github.com/HWRM/KarosGraveyard/wiki" bg_class="bg-guidestone" title="Reference" class="h-96">
		<p class="font-bold">
			Karos Graveyard is the largest and most complete modding reference for Homeworld: Remastered.
		</p>
		<br>
		<p>
			Contains reference for modding functions, tutorials, variable references, user-created functions and more!
		</p>
		<p>
			Written and maintained by community members.
		</p>
	</ImageLink>
	<ImageLink href="/" bg_class="bg-battle" title="Attribute Lookup" class="h-96">
		<p class="font-bold">
			Attribute lookup lets you search for ships, subsystems, or weapons by their filenames and displays their data in a readable format.
		</p>
	</ImageLink>
	<ImageLink href="tools" bg_class="bg-swarmerconcept" title="Web Tools" class="h-96">
		<p>
			Web-hosted tools for modding.
		</p>
	</ImageLink>
</section>