<script lang="ts">
	export let direction: `row` | `col` = `row`;
	let other_direction: `row` | `col` = direction == `row` ? `col` : `row`;
	export let count: number = 2;
	export let gap: number = 4;
	let clazz = ``;
	export { clazz as class };
</script>

<div class="grid grid-flow-{direction} grid-{other_direction}s-{count} gap-{gap} {clazz}">
	<slot></slot>
</div>
