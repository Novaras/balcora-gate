<script lang="ts">
	import { onMount } from 'svelte';
	import cookie from 'js-cookie';

	let enabled: boolean = true;
	const toggle = (override?: boolean) => {
		if (override !== undefined) enabled = override;
		else {
			enabled = !enabled;
		}
		const body_el = document.getElementsByTagName(`body`)[0];
		if (enabled) {
			body_el.classList.add(`dark`);
			cookie.set(`dark_mode`, `true`);
		} else {
			body_el.classList.remove(`dark`);
			cookie.remove(`dark_mode`);
		}
	};
	onMount(() => {
		toggle(cookie.get(`dark_mode`) === `true`);
	});
</script>

<button class="btn" on:click={() => toggle()}>
	{ enabled ? `Light Mode` : `Dark Mode` }
</button>