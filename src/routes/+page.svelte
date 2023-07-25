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
	import { messages, push, remove } from '$lib/stores/message';
	import { get, writable } from 'svelte/store';

	import { spring } from 'svelte/motion';
	import { avatar, randomAvatar } from '$lib/stores/avatar';
	let container;
	let msg = [];

	const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	const twitchUsernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{3,24}$/;

	messages.subscribe((value) => {
		msg = value;
	});

	let configuration = {};

	config.subscribe((value) => {
		configuration = value;
	});

	randomAvatar();

	let pageTotal = 6;
	let activePage = 0;

	let channel = '';
	let blacklist = '';
	let customAvatar = '';

	const components = {
		Default: Default,
		Dark: Dark,
		Light: Light,
		Glass: Glass,
		'High Contrast Dark': Flatwhite,
		'High Contrast Light': Flatdark,
		'linear rgb': Linearrgb,
		'Blue & Purple': Bluepurple,
		'Arc-en-ciel': Rgb,
		Pivotass: Pivotass,
		Neon: Neon
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

	const randomColorHexaCode = () => {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
		return color;
	};

	let usernames = ['Bouns', 'Maouui', 'Rush', 'Pivotass', 'Guillaume'];

	const eventName = [
		{
			name: 'Messages',
			type: 'message',
			test: {
				message: 'Ceci est un message de test',
				username: 'Username',
				type: 'tchat',
				tagsUrl: [
					'https://static-cdn.jtvnw.net/badges/v1/b80f038a-0a47-4e24-b48f-63ab7cecbee5/3',
					'https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/3'
				],
				color: randomColorHexaCode(),
				_id: Date.now()
			}
		},
		{
			name: 'Subscription',
			type: 'sub',
			test: {
				message: `Merci pour le Sub @${usernames[Math.floor(Math.random() * usernames.length)]}`,
				name: 'Sub',
				type: 'sub'
			}
		},
		{
			name: 'Subscription Gift',
			type: 'subgift',
			test: {
				message: `Merci @${
					usernames[Math.floor(Math.random() * usernames.length)]
				} pour les ${Math.floor(Math.random() * 100)} sub gift`,
				name: 'Sub Gift',
				type: 'sub'
			}
		},
		{
			name: 'Cheers',
			type: 'cheer',
			test: {
				message: `Merci @${
					usernames[Math.floor(Math.random() * usernames.length)]
				} pour les ${Math.floor(Math.random() * 10000)} Bits`,
				name: 'Bits',
				type: 'cheers'
			}
		},
		{
			name: 'Message Delete',
			type: 'messagedeleted',
			test: {
				message: `Attention à ton langage @${
					usernames[Math.floor(Math.random() * usernames.length)]
				}`,
				name: 'Warning',
				type: 'warning'
			}
		},
		{
			name: 'User Ban',
			type: 'ban',
			test: {
				message: `@${usernames[Math.floor(Math.random() * usernames.length)]} a été ban !`,
				name: 'Ban',
				type: 'ban'
			}
		},
		{
			name: 'User TimeOut',
			type: 'timeout',
			test: {
				message: `@${
					usernames[Math.floor(Math.random() * usernames.length)]
				} expulsé pour ${Math.floor(Math.random() * 1000)} secondes`,
				name: 'Time Out',
				type: 'ban'
			}
		}
	];

	let actualMessage = 0;

	const demoMessage = () => {
		console.log('Nouveau message');
		push({
			message: MessageInfo[actualMessage],
			username: usernames[Math.floor(Math.random() * usernames.length)],
			type: 'tchat',
			tagsUrl: [
				'https://static-cdn.jtvnw.net/badges/v1/b80f038a-0a47-4e24-b48f-63ab7cecbee5/3',
				'https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/3'
			],
			color: randomColorHexaCode()
		});

		randomAvatar();

		actualMessage++;
		if (actualMessage >= MessageInfo.length) actualMessage = 0;
	};

	setTimeout(() => {
		demoMessage();
	}, 1000);

	setInterval(() => demoMessage(), 5000);

	$: activePage, configuration, checkNext();

	let canNext = true;

	const checkNext = () => {
		if (activePage == 1) {
			canNext = configuration.channels.length > 0;
		} else if (activePage == 2) {
			canNext = configuration.events.length > 0;
		} else {
			canNext = true;
		}
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
			{#key configuration.position}
				<svelte:component this={components[configuration.theme]} />
			{/key}

			{#if configuration.avatar == 'true' && msg.length}
				<Avatar />
			{/if}
		</div>
	</div>

	<Clip />
</main>

<div class="configuration">
	<div class="container" bind:this={container}>
		<div class="body">
			<h2>✨ Twitchouns ✨</h2>
			{#if activePage == 0}
				<p>
					Bienvenue sur <u>la page de configuration</u> du meilleur tchat twitch, cliquez sur
					<b>Commencer la configuration</b> pour debuter la configuration et obtenir le liens à ajouter
					au votre scene.
				</p>
			{:else if activePage == 1}
				<p>
					Qu'elles sont <b>les chaines</b> que vous <u>souhaitez afficher</u> dans votre tchat ? 📹
				</p>

				<div class="inputContainer">
					<input
						type="text"
						bind:value={channel}
						placeholder="Nom de votre chaine twitch"
						on:keyup={(e) => {
							if (e.key == 'Enter') {
								if (!channel || configuration.channels.includes(channel)) return;
								if (!twitchUsernameRegex.test(channel)) {
									push({
										message: `Le nom de chaine fournis n'est pas valide`,
										name: 'Erreur',
										type: 'ban'
									});
									return;
								}

								configuration.channels = [...configuration.channels, channel.toLowerCase()];
								push({
									message: `La chaine ${channel} a bien été ajouté`,
									name: 'Info',
									type: 'cheers'
								});

								channel = '';
							}
						}}
					/>
					<button
						disabled={!channel || configuration.channels.includes(channel)}
						on:click={() => {
							if (!channel || configuration.channels.includes(channel)) return;
							if (!twitchUsernameRegex.test(channel)) {
								push({
									message: `Le nom de chaine fournis n'est pas valide`,
									name: 'Erreur',
									type: 'ban'
								});
								return;
							}

							configuration.channels = [...configuration.channels, channel];

							push({
								message: `La chaine ${channel} a bien été ajouté`,
								name: 'Info',
								type: 'cheers'
							});

							channel = '';
						}}>Ajouter</button
					>
				</div>

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
				<p>
					Qu'elle sont <b>les éléments</b> que vous <u>souhaitez afficher</u> dans votre tchat ? 🤔
				</p>
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
											remove(event?.test?.message, '');
										} else {
											configuration.events = [...configuration.events, event.type];
											push(event.test, 12000);
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
				<p>De quel <b>côté</b> souhaitez-vous afficher votre tchat ? 📝</p>
				<div class="list">
					<p>
						<label>
							<input
								type="radio"
								bind:group={configuration.position}
								name="position"
								value="left"
							/>
							Gauche
						</label>
					</p>

					<p>
						<label>
							<input
								type="radio"
								bind:group={configuration.position}
								name="position"
								value="right"
							/>
							Droite
						</label>
					</p>
				</div>
			{:else if activePage == 5}
				<p>Ne pas afficher certaine personne dans votre tchat, c'est possible ! 🤫</p>

				<div class="inputContainer">
					<input
						type="text"
						bind:value={blacklist}
						placeholder="nightbot"
						on:keyup={(e) => {
							if (e.key == 'Enter') {
								if (!blacklist || configuration?.blacklist?.includes(blacklist)) return;
								if (!twitchUsernameRegex.test(blacklist)) {
									push({
										message: `Le nom de chaine fournis n'est pas valide`,
										name: 'Erreur',
										type: 'ban'
									});
									return;
								}

								configuration.blacklist = [...configuration.blacklist, blacklist];
								blacklist = '';
							}
						}}
					/>
					<button
						disabled={!blacklist || configuration?.blacklist?.includes(blacklist)}
						on:click={() => {
							if (!blacklist || configuration.blacklist.includes(blacklist)) return;
							if (!twitchUsernameRegex.test(blacklist)) {
								push({
									message: `Le nom de chaine fournis n'est pas valide`,
									name: 'Erreur',
									type: 'ban'
								});
								return;
							}

							configuration.blacklist = [...configuration.blacklist, blacklist];
							blacklist = '';
						}}>Ajouter</button
					>
				</div>
				<div class="list">
					{#each configuration.blacklist as blacklist (blacklist)}
						<p
							on:click={() => {
								configuration.blacklist = configuration?.blacklist?.filter((c) => c != blacklist);
							}}
						>
							{blacklist}
						</p>
					{/each}
				</div>
			{:else if activePage == 6}
				<p>Voulez vous avoir un avatar à coté de votre tchat</p>
				<button
					on:click={() => {
						configuration.avatar = configuration.avatar == 'true' ? 'false' : 'true';
					}}
				>
					{#if configuration.avatar == 'true'}
						Désactiver
					{:else}
						Activer
					{/if}
				</button>

				{#if configuration.avatar == 'true'}
					<br />
					<p>Vous pouvez mettre des avatars custom en ajoutant les liens des images ici:</p>
					<div class="inputContainer">
						<input
							type="text"
							bind:value={customAvatar}
							placeholder="nightbot"
							on:keyup={(e) => {
								if (e.key == 'Enter') {
									if (!customAvatar || configuration.customAvatar.includes(customAvatar)) return;
									if (!urlRegex.test(customAvatar)) {
										push({
											message: `Le liens fournis n'est pas valide`,
											name: 'Erreur',
											type: 'ban'
										});
										return;
									}

									configuration.customAvatar = [...configuration.customAvatar, customAvatar];
									customAvatar = '';
								}
							}}
						/>
						<button
							on:click={() => {
								if (!customAvatar || configuration.customAvatar.includes(customAvatar)) return;
								if (!urlRegex.test(customAvatar)) {
									push({
										message: `Le liens fournis n'est pas valide`,
										name: 'Erreur',
										type: 'ban'
									});

									return;
								}
								configuration.customAvatar = [...configuration.customAvatar, customAvatar];
								customAvatar = '';
							}}>Ajouter</button
						>
					</div>

					<div class="list">
						{#each configuration.customAvatar as customAvatar (customAvatar)}
							<p
								on:click={() => {
									configuration.customAvatar = configuration.customAvatar.filter(
										(c) => c != customAvatar
									);
								}}
							>
								{customAvatar}
							</p>
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<div class="footer">
			{#if activePage > 0}
				<button on:click={() => (activePage -= 1)}>previous</button>
			{/if}

			{#if activePage <= pageTotal}
				<button
					disabled={!canNext}
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
	.alignLeft li {
		transform-origin: bottom left;
		text-align: left;
	}

	.alignRight li {
		transform-origin: bottom right;
		text-align: right;
	}

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
			// overflow: hidden;
			overflow: scroll;
			transition: height 0.5s ease;
			// overflow-y: hidden;
			///

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

				input {
					padding: 5px 10px;
					border-radius: 5px;
					border: solid;
					// background-color: #ff6d6d;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				}

				.inputContainer {
					display: grid;
					grid-template-rows: 'input button';
					grid-template-columns: 1fr 0.2fr;
					gap: 5px;

					input {
						grid-area: 'input';
					}

					button {
						grid-area: 'button';

						// padding: 10px 20px;
						border-radius: 5px;
						border: none;
						background-color: #f0f0f0;
						box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
						cursor: pointer;
						transition: all 0.2s ease-in-out;

						&:hover {
							background-color: #e0e0e0;
						}

						&:disabled {
							background-color: #f0f0f0;
							cursor: not-allowed;
						}
					}
				}
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

					&:disabled {
						background-color: #f0f0f0;
						cursor: not-allowed;
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
