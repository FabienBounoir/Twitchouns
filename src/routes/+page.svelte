<script>
	import { tweened } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';

	import Avatar from '$lib/components/avatar.svelte';
	import Clip from '$lib/components/clip.svelte';

	import { config } from '$lib/stores/config';
	import { messages, push, remove } from '$lib/stores/message';
	import { randomAvatar } from '$lib/stores/avatar';

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

	let colorVar = `${Math.floor(Math.random() * 106)},${Math.floor(
		Math.random() * 106
	)},${Math.floor(Math.random() * 106)}`;

	//////////ANIMATE HEIGHT/////////
	let heightTarget = tweened(0, {
		easing: expoOut,
		duration: 1000
	});

	/**
	 * @param {HTMLElement} node
	 * @param {number} index
	 */
	const childrenHeightAt = (node, index) => {
		/**
		 * @param {typeof index} index
		 */
		const update = (index) => {
			const child = node.children[index];
			const childRect = child.getBoundingClientRect();

			$heightTarget = childRect.height;
		};

		update(index);

		return { update };
	};
	//////////ANIMATE HEIGHT/////////

	/////////REGEX/////////
	const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	const twitchUsernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]{3,24}$/;
	/////////REGEX/////////

	// @ts-ignore
	let badgets = []; // all badges
	// @ts-ignore
	let msg = []; // all message
	let configuration = {}; // all configuration

	let canNext = true; // check if user can go to next page

	messages.subscribe((value) => {
		msg = value;
	});

	config.subscribe((value) => {
		configuration = value;
	});

	let pageTotal = 8;
	let activePage = 0;

	/////// element input ///////
	let channel = '';
	let blacklist = '';
	let customAvatar = '';
	let link = '';
	/////// element input ///////

	const getGBadge = async () => {
		const res = await fetch('/api/getGBadge');
		const data = await res.json();

		if (data && data.data && data.data.length > 0) {
			for (let element of data.data) {
				let lien =
					element.versions[0].image_url_4x ||
					element.versions[0].image_url_2x ||
					element.versions[0].image_url_1x;

				badgets.push(lien);
			}
		}
	};

	randomAvatar();
	getGBadge();

	const randomColorHexaCode = () => {
		let letters = '012345678';
		let color = '#';
		for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * letters.length)];
		return color;
	};

	const checkNext = () => {
		if (activePage == 1) {
			canNext = configuration.channels.length > 0;
		} else if (activePage == 2) {
			canNext = configuration.events.length > 0;
		} else {
			canNext = true;
		}
	};

	const generateLink = () => {
		link = `${window.location.origin}/chat/${btoa(JSON.stringify(configuration))}`;

		navigator.clipboard.writeText(link).then(
			function () {
				push({
					message: `Lien copié dans le presse papier`,
					name: 'Information',
					type: 'sub'
				});
			},
			function () {
				console.log('Copie echoué');
			}
		);
	};

	////Différents thèmes/////
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
	////Différents thèmes/////

	const usernames = ['Bouns', 'Maouui', 'Rush', 'Pivotass', 'Guillaume'];

	const MessageInfo = [
		'Oh bienvenue à toi ❤️',
		"J'espere que tu vas bien",
		'Tu es actuellement sur la page pour me configurer',
		"Pour cela rien de plus simple il suffit de choisir les chaines sur lesquelles tu veux que j'écoute",
		'Puis de choisir les interactions que tu veux',
		"Et pour finir de copier le lien est de l'intégrer dans une source navigateur sur OBS"
	];

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
				color: randomColorHexaCode()
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
		let messageTest = {
			message: MessageInfo[actualMessage],
			username: usernames[Math.floor(Math.random() * usernames.length)],
			type: 'tchat',
			tagsUrl: []
		};

		if (configuration.badge && badgets.length > 0) {
			for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
				const badge = badgets[Math.floor(Math.random() * badgets.length)];
				if (!messageTest.tagsUrl.includes(badge)) messageTest.tagsUrl.push(badge);
			}
		}

		if (configuration.color) messageTest.color = randomColorHexaCode();

		push(messageTest, 20000);
		randomAvatar();

		actualMessage++;
		if (actualMessage >= MessageInfo.length) actualMessage = 0;
	};

	setTimeout(() => {
		demoMessage();
		setInterval(() => demoMessage(), 5000);
	}, 1000);

	$: activePage, configuration, checkNext();
</script>

<svelte:head>
	<title>⚙️ Overlay Configuration</title>
</svelte:head>

<main id="chat-container">
	<div id="saver" style:--color={colorVar}>
		<div
			class="gridApp {configuration.position === 'left' ? 'gridLeft' : 'gridRight'}"
			style="margin-bottom: {configuration.margin[2]}px; margin-top: {configuration
				.margin[0]}px; margin-left: {configuration.margin[3]}px; margin-right: {configuration
				.margin[1]}px;"
		>
			{#key configuration.position || configuration.avatar}
				<svelte:component this={components[configuration.theme]} />
			{/key}

			{#if configuration.avatar && msg.length}
				<Avatar />
			{/if}
		</div>
	</div>

	<Clip />
</main>

<div class="configuration" style:--color={colorVar}>
	<div class="container">
		<h2>✨ Twitchouns ✨</h2>
		{#key configuration}
			<div
				class="body"
				style:height="{$heightTarget}px"
				style:--page={activePage}
				use:childrenHeightAt={activePage}
			>
				<div class="page">
					<!-- {#if activePage == 0} -->
					<p>
						Bienvenue sur la page de configuration du meilleur tchat twitch, cliquez sur "<b
							>Commencer la configuration</b
						>" pour débuter la configuration et obtenir le lien à ajouter à votre scène
					</p>
				</div>
				<!-- {:else if activePage == 1} -->
				<div class="page">
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
										push(
											{
												message: `Le nom de chaine fournis n'est pas valide`,
												name: 'Erreur',
												type: 'ban'
											},
											7000
										);
										return;
									}

									configuration.channels = [...configuration.channels, channel.toLowerCase()];
									push(
										{
											message: `La chaine ${channel} a bien été ajouté`,
											name: 'Information',
											type: 'cheers'
										},
										10000
									);

									channel = '';
								}
							}}
						/>
						<button
							disabled={!channel || configuration.channels.includes(channel)}
							on:click={() => {
								if (!channel || configuration.channels.includes(channel)) return;
								if (!twitchUsernameRegex.test(channel)) {
									push(
										{
											message: `Le nom de chaine fournis n'est pas valide`,
											name: 'Erreur',
											type: 'ban'
										},
										7000
									);
									return;
								}

								configuration.channels = [...configuration.channels, channel];

								push(
									{
										message: `La chaine ${channel} a bien été ajouté`,
										name: 'Information',
										type: 'cheers'
									},
									10000
								);

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
				</div>
				<!-- {:else if activePage == 2} -->
				<div class="page">
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
				</div>
				<!-- {:else if activePage == 3} -->
				<div class="page">
					<p>Choisissez votre <b>thème favori</b>, celui qui vous fait <b>vibrer</b> ! 💖</p>
					<select bind:value={configuration.theme}>
						{#each Object.keys(components) as theme (theme)}
							<option value={theme}>{theme}</option>
						{/each}
					</select>
				</div>
				<!-- {:else if activePage == 4} -->
				<div class="page">
					<p>Voulez vous <b>afficher les badges</b> des <u>utilisateurs</u> dans le chat ?</p>
					<button
						on:click={() => {
							configuration.badge = !configuration.badge;

							let element = [];

							if (configuration.badge) {
								let nbBadge = Math.floor(Math.random() * 3) + 1;

								for (let i = 0; i < nbBadge; i++) {
									let badge = badgets[Math.floor(Math.random() * badgets.length)];
									if (!element.includes(badge)) {
										element.push(badge);
									}
								}
							}

							msg.map((e) => {
								e.tagsUrl = element;
							});

							messages.set(msg);
						}}
					>
						{#if configuration.badge}
							Désactiver
						{:else}
							Activer
						{/if}
					</button>
				</div>
				<!-- {:else if activePage == 5} -->
				<div class="page">
					<p>Voulez vous <b>afficher les couleurs</b> des <u>utilisateurs</u> dans le chat ?</p>
					<button
						on:click={() => {
							configuration.color = !configuration.color;

							msg.map((e) => {
								e.color = configuration.color ? randomColorHexaCode() : null;
							});
							messages.set(msg);
						}}
					>
						{#if configuration.color}
							Désactiver
						{:else}
							Activer
						{/if}
					</button>
				</div>
				<!-- {:else if activePage == 6} -->
				<div class="page">
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
				</div>
				<!-- {:else if activePage == 7} -->
				<div class="page">
					<p>Voulez vous avoir un avatar à coté de votre tchat</p>
					<button
						on:click={() => {
							configuration.avatar = !configuration.avatar;
						}}
					>
						{#if configuration.avatar}
							Désactiver
						{:else}
							Activer
						{/if}
					</button>

					{#if configuration.avatar}
						<br />
						<p>Vous pouvez mettre des avatars custom en ajoutant les liens des images ici:</p>
						<div class="inputContainer">
							<input
								type="text"
								bind:value={customAvatar}
								placeholder="https://i.imgur.com/6e4RRRF.gif"
								on:keyup={async (e) => {
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

										let info = await fetch(customAvatar).catch(() => {});
										console.log(info);

										if (!info || info.status >= 300 || info.status < 200) {
											push({
												message: `Le liens fournis n'est pas valide: \n ${info.status} ${info.statusText}`,
												name: 'Erreur',
												type: 'ban'
											});
											return;
										}

										configuration.customAvatar = [...configuration.customAvatar, customAvatar];
										randomAvatar();
										customAvatar = '';
									}
								}}
							/>
							<button
								on:click={async () => {
									if (!customAvatar || configuration.customAvatar.includes(customAvatar)) return;
									if (!urlRegex.test(customAvatar)) {
										push({
											message: `Le liens fournis n'est pas valide`,
											name: 'Erreur',
											type: 'ban'
										});

										return;
									}

									let info = await fetch(customAvatar).catch(() => {});
									console.log(info);

									if (!info || info.status >= 300 || info.status < 200) {
										push({
											message: `Le liens fournis n'est pas valide: \n ${info.status} ${info.statusText}`,
											name: 'Erreur',
											type: 'ban'
										});
										return;
									}

									configuration.customAvatar = [...configuration.customAvatar, customAvatar];
									randomAvatar();
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
										randomAvatar();
									}}
								>
									{customAvatar.split('/').pop().split('?')[0]}
								</p>
							{/each}
						</div>
					{/if}
				</div>
				<div class="page">
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
				</div>
				<!-- {:else if activePage == 9} -->
				<div class="page">
					<p>
						Vous êtes maintenant prêt à <b>utiliser votre tchat</b>, Il ne vous reste plus qu'a
						<u>ajouter le liens</u>
						suivant dans votre <b>scene</b>
					</p>

					<textarea
						bind:value={link}
						style="width: 100%; height: 100px; resize: none; border-radius: 5px; border: solid; padding: 5px 10px; background-color: #f0f0f0; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
						readonly
					/>
				</div>
				<!-- {/if} -->
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
								generateLink();
								activePage++;
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
		{/key}
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

		.container::-webkit-scrollbar {
			display: none;
		}

		.container {
			overflow: scroll;
			transition: height 0.5s ease;

			-ms-overflow-style: none; /* IE and Edge */
			scrollbar-width: none; /* Firefox */

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
				// height: auto;
				// display: flex;
				// flex-direction: column;
				// gap: 10px;

				//////

				// margin: 5rem;
				// border-radius: 1rem;

				// box-shadow: 0 0.5rem 2rem -1rem black;

				display: flex;
				align-items: center;

				overflow: hidden;

				.page {
					padding: 0.5rem;
					display: flex;
					flex-direction: column;
					flex: 1 0 100%;
					gap: 10px;
					height: max-content;
					// padding: 2rem;

					translate: calc(var(--page) * -100%);
					transition: translate cubic-bezier(0.1, 0.75, 0.25, 1) 1000ms;

					// h1 {
					// 	margin-bottom: 1em;
					// }

					// p {
					// 	margin-top: 1em;
					// }
				}

				/////

				input {
					padding: 5px 10px;
					border-radius: 5px;
					border: solid;
					// background-color: #ff6d6d;
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
				}

				textarea {
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
					background-color: rgb(var(--color, 51 0 106), 50%);
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
		background-size: auto;
		background-image: url('/noise-light.png');
		background-color: rgb(var(--color, 51 0 106));
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
