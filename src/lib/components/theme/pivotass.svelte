<script>
	import { config } from '$lib/stores/config';
	import { messages } from '$lib/stores/message';
	import { get } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	$messages = get(messages);
	$config = get(config);
</script>

<div class="textfields">
	<ul class={$config.position === 'left' ? 'alignLeft' : 'alignRight'}>
		{#each $messages as message, i (message._id)}
			{@const previous = $messages[i - 1]}
			{@const next = $messages[i + 1]}
			{@const first = previous?.username !== message.username}
			{@const last = next?.username !== message.username}
			{@const between = !first && !last}
			<li class={$config.theme} transition:slide={{ easing: expoOut }}>
				{#if message.type == 'tchat'}
					<p
						class="message-container"
						class:first
						class:between
						class:last
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
						<span class="message">
							{#if first}
								<span class="username">
									{message.username}
								</span>
							{/if}
							{@html message.message}
							{#if message.tagsUrl?.length && next?.username !== message.username}
								<span class="badges">
									{#each message.tagsUrl as badge (badge)}
										<img src={badge} alt=" " class="badge" />
									{/each}
								</span>
							{/if}
						</span>

						<!-- {#if next?.username !== message.username}
							<b class="username">
								{message.username}
							</b>
						{/if} -->
					</p>
				{:else}
					<div in:fade={{ duration: 200 }} class="Embed {message.type}">
						{message.name}
						{message.message}
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
		gap: 0.5rem;

		.badges {
			position: absolute;

			bottom: 0;
			left: -0.75rem;

			display: flex;
			gap: 0.5rem;
			align-items: center;

			background-color: white;
			padding: 0.35rem 0.85rem;
			border-radius: 1.5rem;

			translate: 0 55%;
		}

		.username {
			color: var(--color);
			font-weight: 900;
			display: block;
			width: max-content;
			margin-bottom: 0.5rem;
		}

		.message {
			display: block;
			position: relative;

			background-color: rgba(255 255 255 / 85%);
			border: 1px solid white;
			padding: 0.5rem 1rem;
			padding-right: 2rem;
			border-radius: 1rem;
			box-shadow: 0 0.5rem 1.25rem -0.5rem var(--color);
		}

		&.first {
			margin-top: 1.5rem;
		}

		&.last:has(.badges) {
			margin-bottom: 2rem;

			.message {
				padding-bottom: 1rem;
			}
		}

		&.between .message,
		&.first:not(.last) .message {
			border-bottom-left-radius: 0.5rem;
		}

		&.between .message,
		&.last:not(.first) .message {
			border-top-left-radius: 0.5rem;
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

	.Embed {
		padding: 2rem;
		background-color: rgba(255, 255, 255, 0.7);
		color: var(--fg);
		border-bottom: 3px solid var(--bg);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* type de message color */
	.ban {
		--bg: hsla(0, 66%, 46%, 0.7);
		--fg: hsla(0, 66%, 10%, 0.7);
	}

	.resub {
		--bg: hsla(199, 69%, 46%, 0.801);
		--fg: hsla(199, 69%, 10%, 0.801);
	}

	.sub {
		--bg: hsla(199, 78%, 53%, 0.702);
		--fg: hsla(199, 78%, 10%, 0.7);
	}

	.warning {
		--bg: hsla(37, 67%, 48%, 0.7);
		--fg: hsla(37, 67%, 10%, 0.7);
	}

	.cheers {
		--bg: hsla(273, 98%, 65%, 0.7);
		--fg: hsla(273, 98%, 10%, 0.7);
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

		font-style: normal;
		font-weight: 500;
		font-size: 20px;
		line-height: 23px;

		width: 100%;
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

	.rgb {
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.3);
		/* background: rgba(218, 218, 218, 0.6); */
		background: rgba(199, 199, 199, 0.646);
		box-shadow: 0 8px 12px 0 rgba(31, 38, 135, 0.37);
		text-shadow: 0 2px 4px rgb(0 0 0 / 66%);
		background-color: rgba(255, 0, 0, 0.6);
		animation: RGBWhiteMode 5s infinite linear;
	}

	@keyframes RGBWhiteMode {
		0% {
			background-color: rgba(193, 0, 0, 0.6);
		}
		12.5% {
			background-color: rgba(176, 58, 46, 0.6);
		}
		25% {
			background-color: rgba(175, 96, 26, 0.6);
		}
		37.5% {
			background-color: rgba(183, 149, 11, 0.6);
		}
		50% {
			background-color: rgba(35, 155, 86, 0.6);
		}
		62.5% {
			background-color: rgba(40, 116, 166, 0.6);
		}
		75% {
			background-color: rgba(31, 97, 141, 0.6);
		}
		87.5% {
			background-color: rgba(108, 52, 131, 0.6);
		}
		100% {
			background-color: rgba(193, 0, 0, 0.6);
		}
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
</style>
