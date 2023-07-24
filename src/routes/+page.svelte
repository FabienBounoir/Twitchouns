<script>
	import Avatar from '$lib/components/avatar.svelte';
	import Clip from '$lib/components/clip.svelte';
	import Bluepurple from '$lib/components/theme/bluepurple.svelte';
	import Dark from '$lib/components/theme/dark.svelte';
	import Default from '$lib/components/theme/default.svelte';
	import Flatdark from '$lib/components/theme/flatdark.svelte';
	import Flatwhite from '$lib/components/theme/flatwhite.svelte';
	import Glass from '$lib/components/theme/glass.svelte';
	import Light from '$lib/components/theme/light.svelte';
	import Linearrgb from '$lib/components/theme/linearrgb.svelte';
	import Neon from '$lib/components/theme/neon.svelte';
	import Pivotass from '$lib/components/theme/pivotass.svelte';
	import Rgb from '$lib/components/theme/rgb.svelte';
	import { config } from '$lib/stores/config';
	import { messages, push } from '$lib/stores/message';
	import { get, writable } from 'svelte/store';

	let msg = [];

	messages.subscribe((value) => {
		msg = value;
	});

	let configuration = get(config);
	let pageTotal = 5;
	let activePage = 0;

	let channel = '';

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

	const MessageInfo = [
		'Bienvenue sur la page de configuration de votre tchat twitch',
		'Pour commencer, veuillez entre votre nom de chaine twitch',
		'Ensuite, choisissez le theme de votre tchat',
		'Choisissez la position de votre tchat',
		'Choisissez la taille de votre tchat',
		'Choisissez la couleur de votre tchat',
		'Choisissez les events que vous voulez afficher',
		'Choisissez les personnes a ne pas afficher dans votre tchat'
	];

	const eventName = [
		{
			name: 'Messages',
			type: 'message'
		},
		{
			name: 'Subscription',
			type: 'sub'
		},
		{
			name: 'Subscription Gift',
			type: 'subgift'
		},
		{
			name: 'Cheers',
			type: 'cheer'
		},
		{
			name: 'Message Delete',
			type: 'messagedeleted'
		},
		{
			name: 'User Ban',
			type: 'ban'
		},
		{
			name: 'User TimeOut',
			type: 'timeout'
		}
	];

	let usernames = ['Bouns', 'Maouui', 'Rush', 'Pivotass', 'Guillaume'];

	let actualMessage = 0;

	setInterval(() => {
		console.log('Nouveau message');
		push({
			message: MessageInfo[actualMessage],
			username: usernames[Math.floor(Math.random() * usernames.length)],
			type: 'tchat',
			tagsUrl: [
				'https://static-cdn.jtvnw.net/badges/v1/b80f038a-0a47-4e24-b48f-63ab7cecbee5/3',
				'https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/3'
			],
			color: randomColorHexaCode(),
			_id: Date.now()
		});

		actualMessage++;
		if (actualMessage >= MessageInfo.length) actualMessage = 0;
	}, 4000);

	const randomColorHexaCode = () => {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
		return color;
	};
</script>

<svelte:head>
	<title>⚙️ Overlay Configuration</title>
</svelte:head>

<h1>Bienvenue sur la page de Config de Twitchouns</h1>
<pre style="color:white; position: fixed; z-index:999">{JSON.stringify(
		configuration,
		null,
		2
	)}</pre>

<main id="chat-container">
	<div id="saver">
		<div
			class="gridApp {configuration.position === 'left' ? 'gridLeft' : 'gridRight'}"
			style="margin-bottom: {configuration.margin[2]}px; margin-top: {configuration
				.margin[0]}px; margin-left: {configuration.margin[3]}px; margin-right: {configuration
				.margin[1]}px;"
		>
			<svelte:component this={components[configuration.theme]} />

			{#if configuration.avatar == 'true' && msg.length}
				<Avatar />
			{/if}
		</div>
	</div>

	<Clip />
</main>

<div class="configuration">
	<div class="container">
		<div class="body">
			<h2>✨ Twitchouns ✨</h2>
			{#if activePage == 0}
				<p>
					Bienvenue sur la page de configuration du meilleur tchat twitch, cliquez sur <b
						>Commencer la configuration</b
					> pour debuter la configuration et obtenir le liens à ajouter au votre scene.
				</p>
			{:else if activePage == 1}
				<p>Qu'elles sont les chaines que vous souhaitez afficher dans votre tchat ?</p>
				<input type="text" bind:value={channel} placeholder="Nom de votre chaine twitch" />
				<button
					on:click={() => {
						if (!channel || configuration.channels.includes(channel)) return;
						configuration.channels = [...configuration.channels, channel];
						channel = '';
					}}>Ajouter</button
				>
				<div class="list">
					{#each configuration.channels as channel (channel)}
						<p
							on:click={() => {
								configuration.channels = configuration.channels.filter((c) => c != channel);
							}}
						>
							{channel}
						</p>
					{/each}
				</div>
			{:else if activePage == 2}
				<p>Qu'elle sont les éléments que vous souhaitez afficher dans votre tchat ?</p>
				<div class="list">
					{#each eventName as event (event.type)}
						<p>
							<label id={event.type} name={event.type}
								>{event.name}
								<input
									type="checkbox"
									id={event.type}
									name={event.type}
									value={event.type}
									checked={configuration.events.includes(event.type)}
									on:change={(e) => {
										if (configuration.events.includes(event.type)) {
											configuration.events = configuration.events.filter((c) => c != event.type);
										} else {
											configuration.events = [...configuration.events, event.type];
										}
									}}
								/>
							</label>
						</p>
					{/each}
				</div>
			{:else if activePage == 3}
				<p>Choisissez votre <b>thème favori</b>, celui qui vous fait <b>vibrer</b> ! 💖</p>
				<select bind:value={configuration.theme}>
					{#each Object.keys(components) as theme (theme)}
						<option value={theme}>{theme}</option>
					{/each}
				</select>
			{:else if activePage == 4}
				<button
					on:click={() => {
						let themeName =
							Object.keys(components)[Math.floor(Math.random() * Object.keys(components).length)];

						configuration.theme = themeName;
					}}>Event type</button
				>
			{/if}
		</div>

		<div class="footer">
			{#if activePage > 0}
				<button on:click={() => (activePage -= 1)}>previous</button>
			{/if}

			{#if activePage <= pageTotal}
				<button
					on:click={() => {
						if (activePage == pageTotal) {
							console.log('Fin de la configuration');
						} else {
							activePage++;
						}
					}}
				>
					{#if activePage == 0}
						Commencer la configuration
					{:else if activePage == pageTotal}
						Terminer la configuration
					{:else}
						Suivant
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.configuration {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		justify-content: center;
		align-items: center;

		.container {
			max-width: 600px; /* Largeur maximale de la div */
			padding: 20px;
			background-color: #f0f0f0;
			border-radius: 10px;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
			// height: min(80vh, 600px);
			display: flex;
			flex-direction: column;
			gap: 20px;
			max-width: 600px;
			width: 600px;

			.body {
				height: auto;
				display: flex;
				flex-direction: column;
				gap: 10px;
			}

			.list {
				display: flex;
				flex-direction: row;
				gap: 5px;

				flex-flow: wrap;

				p {
					cursor: pointer;
					padding: 5px 10px;
					border-radius: 5px;
					background-color: #ff6d6d;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				}
			}

			select {
				padding: 5px 10px;
				border-radius: 5px;
				// background-color: #ff6d6d;
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
			}

			.footer {
				display: flex;
				justify-content: space-between;

				button {
					padding: 10px 20px;
					border-radius: 5px;
					border: none;
					background-color: #f0f0f0;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
					cursor: pointer;
					transition: all 0.2s ease-in-out;

					&:hover {
						background-color: #e0e0e0;
					}
				}
			}
		}
	}

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

	div#saver {
		background-color: #111;
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
</style>
