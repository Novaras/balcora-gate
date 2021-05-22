<script lang="ts">
	let enabled = false;
	const toggle = (override?: boolean) => {
		if (override !== undefined) enabled = override;
		else {
			enabled = !enabled;
		}
		const body_el = document.getElementsByTagName(`body`)[0];
		body_el.classList.remove(`dark`);
		if (enabled) {
			body_el.classList.add(`dark`);
		}
	};
</script>

<button class="btn" on:click={() => toggle()}>
	{ enabled ? `Light Mode` : `Dark Mode` }
</button>