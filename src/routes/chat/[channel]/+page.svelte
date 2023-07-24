<script>
	import { onMount } from 'svelte';
	import * as events from '$lib/events/index';
	import { get } from 'svelte/store';

	import { fade, scale, slide } from 'svelte/transition';

	import { config } from '$lib/stores/config';
	import { messages } from '$lib/stores/message';

	import Avatar from '$lib/components/avatar.svelte';
	import Clip from '$lib/components/clip.svelte';
	import { page } from '$app/stores';

	import { badges } from '$lib/stores/badges';
	import { randomAvatar } from '$lib/stores/avatar';
	import { asVideo, clip } from '$lib/stores/clip';
	import Dark from '$lib/components/theme/dark.svelte';
	import Light from '$lib/components/theme/light.svelte';
	import Glass from '$lib/components/theme/glass.svelte';
	import Flatwhite from '$lib/components/theme/flatwhite.svelte';
	import Flatdark from '$lib/components/theme/flatdark.svelte';
	import Linearrgb from '$lib/components/theme/linearrgb.svelte';
	import Bluepurple from '$lib/components/theme/bluepurple.svelte';
	import Rgb from '$lib/components/theme/rgb.svelte';
	import Default from '$lib/components/theme/default.svelte';
	import Pivotass from '$lib/components/theme/pivotass.svelte';
	import Neon from '$lib/components/theme/neon.svelte';
	import Animation from '$lib/components/animation.svelte';

	// export let data;
	$config.channels = $page.params.channel.split(',');

	let tchat = [];

	location.search.split(/[?&]/g).reduce((a, pair) => {
		if (!pair.trim()) return a;
		const [key, value] = pair.split('=');
		$config[key] = value.includes(',') ? value.split(',') : value;
		return a;
	}, {});

	// &customAvatar=https://media.discordapp.net/attachments/1014101467126304798/1126123705878183937/fire_3d_1.png,https://cdn.discordapp.com/attachments/1014101467126304798/1122909288600436787/radio_3d_2.png,https://media.discordapp.net/attachments/1014101467126304798/1122909148204515388/broom_3d.png,https://cdn.discordapp.com/attachments/1014101467126304798/1122908832994177166/detective_3d_default_1.png
	console.log($config);

	let tchatMax = 10;

	const client = new tmi.Client({
		options: { debug: false },
		connection: {
			secure: true,
			reconnect: true
		},

		channels: $config?.channels || ['badbounstv']
	});

	//connection au tchat twitch
	client.connect();

	$messages = get(messages);

	////// init all Event ///////
	for (let event of Object.values(events)) {
		console.log(event);
		let eventInit = new event($config);
		console.log(eventInit.getEventName());
		if (
			$config.events.includes(eventInit.getEventName()) ||
			['clearchat', 'messagedeleted'].includes(eventInit.getEventName())
		) {
			console.log('add ' + eventInit.getEventName());
			client.on(eventInit.getEventName(), (...args) => eventInit.run(...args));
		} else {
			console.log('continue ' + eventInit.getEventName());
			continue;
		}
	}

	const getGBadge = async () => {
		const res = await fetch('/api/getGBadge');
		const data = await res.json();
		console.log(data);
		if (data && data.data && data.data.length > 0) {
			$badges.global = data.data;
		}
	};

	const getCBadge = async () => {
		let channels = $config?.channels;
		for (let channel of channels) {
			console.log(channel);
			const res = await fetch('/api/getCBadge?channel=' + channel.replace('#', ''));
			const data = await res.json();
			console.log(data);
			if (data && data.data && data.data.length > 0) {
				$badges.channels[channel.replace('#', '')] = data.data;
			}
		}
	};

	getGBadge();
	getCBadge();
	randomAvatar();

	const components = {
		dark: Dark,
		light: Light,
		glass: Glass,
		flatwhite: Flatwhite,
		flatdark: Flatdark,
		linearrgb: Linearrgb,
		bluepurple: Bluepurple,
		rgb: Rgb,
		default: Default,
		pivotass: Pivotass,
		neon: Neon
	};
</script>

<svelte:head>
	<title>💭 Overlay {$config.channels}</title>
</svelte:head>

{#if $config.debug}
	<div class="debug-background" />

	<pre style="position: absolute;">{JSON.stringify($config, null, 2)}</pre>
{/if}

<Animation />

<main>
	<div id="saver">
		<!-- {#each confetti as c}
            <img
                class="animationAvatar"
                style="left: {c.x}%; top: {c.y}%; transform: scale({c.r})"
                src={c.character}
                alt=" "
            />
        {/each} -->
		<div
			class="gridApp {$config.position === 'left' ? 'gridLeft' : 'gridRight'}"
			style="margin-bottom: {$config.margin[2]}px; margin-top: {$config
				.margin[0]}px; margin-left: {$config.margin[3]}px; margin-right: {$config.margin[1]}px;"
		>
			<svelte:component this={components[$config.theme]} />

			{#if $config.avatar == 'true' && $messages.length}
				<Avatar />
			{/if}
		</div>
	</div>

	<Clip />
</main>

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	*,
	*::after,
	*::before {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		overflow: hidden;
		overflow-x: hidden;
	}

	.debug-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;

		background: url('https://media.discordapp.net/attachments/1014101467126304798/1131938692437655633/image.png?width=2060&height=1288');
	}

	.animationAvatar {
		position: absolute;
		user-select: none;
	}

	.videoClip {
		position: fixed;
		top: 20;
		left: 20;
		width: 30%;
		object-fit: cover;
		z-index: -1;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	div#saver {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* background-image: url("./assets/background.png"); */
		background-size: cover;
	}

	div#saver img.animationAvatar {
		width: 5em;
	}

	.gridApp {
		display: grid;
		grid-template-areas: 'text avatar';
		/* grid-template-columns: 1fr 0.1fr; */
		position: absolute;
	}

	.gridRight {
		grid-template-areas: 'text avatar';
		right: 0;
		bottom: 0;
	}

	.gridLeft {
		grid-template-areas: 'avatar text';
		left: 0;
		bottom: 0;
	}

	.textfields {
		/* padding: 3em 3em 0em 3em;
        margin: -3em -4em 0em -3em; */

		overflow: hidden;
		overflow-y: auto;
		grid-area: text;
	}

	.avatar {
		place-self: flex-end;
		grid-area: avatar;
	}

	.none {
		display: none;
	}

	.avatar img {
		/* border-radius: 100px; */
		width: 10em;
	}

	.Embed {
		display: grid;
		grid-template-areas:
			'Top'
			'Bottom';
	}

	.top {
		grid-area: Top;
		padding: 10px 20px 10px 20px;
		border-radius: 10px 10px 0px 0px;
		text-align: left;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.bottom {
		grid-area: Bottom;
	}

	.alignRight {
		text-align: -webkit-right;
	}

	.alignLeft {
		text-align: -webkit-left;
	}

	li {
		list-style-type: none;
		/* 
        backdrop-filter: blur( 6px );
        -webkit-backdrop-filter: blur( 6px );  */

		/* background-color: rgb(176, 158, 149); */

		margin: 10px;
		font-style: normal;
		font-weight: 500;
		font-size: 20px;
		line-height: 23px;

		width: max-content;
		max-width: 25em;

		border-radius: 10px;
	}

	.alignLeft li {
		transform-origin: bottom left;
		text-align: left;
	}

	.alignRight li {
		transform-origin: bottom right;
		text-align: right;
	}

	li p {
		margin: 10px 20px 10px 20px;
		font-weight: 350;
		align-items: center;
		word-wrap: break-word;
		/* display: flex; */
	}

	b {
		margin-bottom: auto;
	}

	li p p:first-child {
		margin: 10px 20px 10px 20px;
		font-weight: 300;
		align-items: center;
		display: flex;
		font-weight: bold;
	}

	.emote {
		width: 1.5em;
	}
</style>
