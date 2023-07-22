<script setup>
	import { config } from '../stores/config';
	import { fade, scale, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { clip, asVideo } from '../stores/clip';
</script>

{#if $clip && $asVideo}
	<video
		class="videoClip"
		transition:scale={{ duration: 1000, easing: quintOut }}
		on:error={(error) => {
			console.log(error);
			asVideo.set(false);
		}}
		on:ended={() => asVideo.set(false)}
		autoplay
		muted
	>
		<source src={$clip} type="video/mp4" />
		<track kind="captions" />
	</video>
{/if}

<!-- transition:scale={{ duration: 1000, easing: quintOut }} -->
<style scope>
	.videoClip {
		position: fixed;
		top: 20;
		left: 20;
		width: 30%;
		object-fit: cover;
		z-index: 1;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}
</style>
