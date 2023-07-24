<script setup>
	import { config } from '../stores/config';
	import { fade, scale, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { clip, asVideo } from '../stores/clip';
	import explosion from '$lib/assets/logo/logo-bleu-cyan.png';

	let confettis = [];
	let timeout;
	let frame;

	function animation(characters, nbElement, time) {
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			cancelAnimationFrame(frame);
			confettis = [];
		}, time);

		if (confettis.length != 0) return;

		confettis = new Array(nbElement)
			.fill()
			.map((_, i) => {
				return {
					character: characters[i % characters.length],
					x: Math.random() * 100,
					y: -40 - Math.random() * 100,
					r: 0.1 + Math.random() * 1
				};
			})
			.sort((a, b) => a.r - b.r);

		function loop() {
			frame = requestAnimationFrame(loop);
			confettis = confettis.map((emoji) => {
				emoji.y += 0.3 * emoji.r;
				if (emoji.y > 120) emoji.y = -40;
				return emoji;
			});
		}

		loop();
	}

	// animation([explosion], 100, 10000 * 5);

	export { animation };
</script>

{#each confettis as c}
	<div>
		<img
			class="confettis"
			style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})"
			src={c.character}
			alt=" "
		/>
	</div>
{/each}

<!-- transition:scale={{ duration: 1000, easing: quintOut }} -->
<style scope>
	.confettis {
		position: absolute;
		user-select: none;
		width: 5em;
	}
</style>
