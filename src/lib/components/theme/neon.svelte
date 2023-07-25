<script>
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { config } from '$lib/stores/config';
	import { messages } from '$lib/stores/message';
	import { get } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	$messages = get(messages);
	$config = get(config);

	const icons = {
		sub: 'fa-star',
		resub: 'fa-certificate',
		warning: 'fa-circle-exclamation',
		cheers: 'fa-champagne-glasses',
		ban: 'fa-ban',
		timeout: 'fa-stopwatch'
	};
</script>

<div class="textfields">
	<ul class:avatar={$config.avatar} class:right={$config.position === 'right'}>
		{#each $messages as message, i (message._id)}
			{@const previous = $messages[i - 1]}
			{@const next = $messages[i + 1]}
			<li
				class={$config.theme}
				transition:slide={{ easing: expoOut, axis: message.type === 'tchat' ? 'y' : 'x' }}
			>
				{#if message.type == 'tchat'}
					<div
						class="message-container"
						in:fade={{
							duration:
								$messages.length > 3
									? $messages.length > 6
										? $messages.length >= $config.maxMessage - 1
											? 0
											: 50
										: 100
									: 200
						}}
						style:--color={message.color}
					>
						<div class="head">
							{#if message.tagsUrl?.length}
								<span class="badges">
									{#each message.tagsUrl as badge (badge)}
										<img src={badge} alt=" " class="badge" />
									{/each}
								</span>
							{/if}

							<span class="username">
								{message.username}
							</span>
						</div>

						<span class="message">
							{@html message.message}
						</span>
					</div>
				{:else}
					<!-- <div class="Embed {message.type}">
						<i class="fa {icons[message.type]}" />
						{message.message}
					</div> -->

					<div
						class="message-container {message.type}"
						in:fade={{
							duration:
								$messages.length > 3
									? $messages.length > 6
										? $messages.length >= $config.maxMessage - 1
											? 0
											: 50
										: 100
									: 200
						}}
						style:--color={message.color}
					>
						<div class="head">
							<span class="badges">
								<i class="fa {icons[message.type]}" />
							</span>

							<span class="username">
								{message.name}
							</span>
						</div>

						<span class="message">
							{@html message.message}
						</span>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.message-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		// gap: 0.5rem;

		.badges {
			display: flex;
			gap: 0.1rem;
			align-items: center;
		}

		.username {
			color: var(--fg, --color);
			font-weight: 700;
			display: block;
			width: max-content;
			background-color: var(--bg, white);
			border-radius: 0.5rem;
			padding: 0.1rem 0.5rem;
		}

		.message {
			display: block;
			position: relative;

			background-color: var(--bgHex, rgba(0 0 0 / 15%));
			// border: 1px solid white;
			padding: 0.5rem 0.4rem;
			// padding-right: 2rem;
			border-radius: 0.5rem;
			margin: 0 0 0 0.4rem;
			color: var(--fg, white);
			// box-shadow: 0 0.5rem 1.25rem -0.5rem var(--color);
		}

		.head {
			padding: 0.25rem 0.5rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
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

	:global(body) {
		overflow: hidden;
		overflow-x: hidden;
	}

	.textfields {
		/* padding: 3em 3em 0em 3em;
        margin: -3em -4em 0em -3em; */

		overflow: hidden;
		overflow-y: auto;
		grid-area: text;
	}

	.none {
		display: none;
	}

	i {
		display: flex;
		align-items: center;
		justify-content: center;

		// background-color: var(--bg);
		color: var(--bg);

		// $size: 1.25rem;
		// width: $size;
		// height: $size;

		padding: 0.3rem;

		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;

		animation: wave 1000ms linear infinite;

		@keyframes wave {
			0% {
				top: 0;
				scale: 1;
			}

			33% {
				scale: 0.95;
			}

			50% {
				top: 0.125rem;
			}

			66% {
				scale: 1.05;
			}

			100% {
				top: 0rem;
				scale: 1;
			}
		}
	}

	/* type de message color */
	.ban {
		--bg: hsla(0, 66%, 46%);
		--bgHex: rgba(195, 40, 40, 70%);
		--fg: hsla(0, 66%, 20%);
	}

	.resub {
		--bg: hsla(199, 69%, 46%);
		--bgHex: rgba(36, 147, 198, 70%);
		--fg: hsla(199, 69%, 20%);
	}

	.sub {
		--bg: hsla(199, 78%, 53%);
		--bgHex: rgba(36, 147, 198, 70%);
		--fg: hsla(199, 78%, 20%);
	}

	.warning {
		--bg: hsla(37, 67%, 48%);
		--bgHex: rgba(204, 142, 40, 70%);
		--fg: hsla(37, 67%, 20%);
	}

	.cheers {
		--bg: hsla(273, 98%, 65%);
		--bgHex: rgba(174, 78, 253, 70%);
		--fg: hsla(273, 98%, 20%);
	}

	li {
		list-style-type: none;
		margin-bottom: 0.5rem;
		/* 
        backdrop-filter: blur( 6px );
        -webkit-backdrop-filter: blur( 6px );  */

		/* background-color: rgb(176, 158, 149); */

		font-style: normal;
		font-weight: 500;
		font-size: 20px;
		line-height: 23px;

		max-width: 25em;

		border-radius: 10px;

		&:has(.Embed) {
			width: max-content;
		}

		word-break: break-all;
	}

	.alignLeft li {
		transform-origin: bottom left;
		text-align: left;
	}

	.alignRight li {
		transform-origin: bottom right;
		text-align: right;
	}

	.badge {
		margin: 0 0 0 0.12em;
	}

	.badge:first-child {
		margin: 0;
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

	.badge {
		width: 0.9em;
	}

	ul {
		display: flex;
		flex-direction: column;
		margin-bottom: 0.5rem;
		// gap: 0.5rem;

		&.avatar {
			.Embed {
				--default-radius: 1rem;
			}
		}

		&.right {
			align-items: flex-end;

			.message-container {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				// gap: 0.5rem;

				.badges {
					display: flex;
					gap: 0.1rem;
					align-items: center;
				}

				.username {
					color: var(--fg, --color);
					font-weight: 700;
					display: block;
					width: max-content;
					background-color: var(--bg, white);
					border-radius: 0.5rem;
					padding: 0.1rem 0.5rem;
				}

				.message {
					display: block;
					position: relative;

					background-color: var(--bgHex, rgba(0 0 0 / 15%));
					// border: 1px solid white;
					padding: 0.5rem 0.4rem;
					// padding-right: 2rem;
					border-radius: 0.5rem;
					margin: 0 0.4rem 0 0;
					color: var(--fg, white);
					// box-shadow: 0 0.5rem 1.25rem -0.5rem var(--color);
				}

				.head {
					padding: 0.25rem 0.5rem;
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 0.5rem;
				}
			}
		}
	}
</style>
