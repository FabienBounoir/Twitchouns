<script>
	import { config } from '$lib/stores/config';
	import { messages } from '$lib/stores/message';
	import { get } from 'svelte/store';
	import { fade, scale, slide } from 'svelte/transition';

	$messages = get(messages);
	$config = get(config);
</script>

<div class="textfields">
	<ul class={$config.position === 'left' ? 'alignLeft' : 'alignRight'}>
		{#each $messages as message (message._id)}
			<li
				class="glass"
				in:scale={{
					duration:
						$messages.length > 3
							? $messages.length > 6
								? $messages.length >= $config.maxMessage - 1
									? 100
									: 100
								: 250
							: 500
				}}
				out:slide
			>
				{#if message.type == 'tchat'}
					<p
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
					>
						<span class="badges">
							{#each message.tagsUrl as badge (badge)}
								<img src={badge} alt=" " class="badge" />
							{/each}
						</span>
						<b class="username" style={message.color ? 'color: ' + message.color : ''}
							>{message.username}:</b
						>

						<br />

						<span class="message">{@html message.message}</span>
					</p>
				{:else}
					<div in:fade={{ duration: 200 }} class="Embed">
						<div class="top {message.type}">
							{message.name}
						</div>
						<div class="bottom">
							<p>{message.message}</p>
						</div>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.glass p .username {
		font-size: 0.8em;
		font-weight: normal;
	}

	.glass p .badge {
		vertical-align: middle;
	}

	.glass p .lineargradient {
		/* -webkit-mask-size: 300px 100vh; */
		/* -webkit-mask-image: -webkit-gradient(linear, center top, center bottom, 
        color-stop(0.00,  rgba(0,0,0,0)),
        color-stop(1.00,  rgba(0,0,0,1))); */
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
		display: grid;
		grid-template-areas:
			'Top'
			'Bottom';
	}

	.top {
		grid-area: Top;
		padding: 10px 20px 10px 20px;
		border-radius: 0.3em;
		text-align: left;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.bottom {
		grid-area: Bottom;
	}

	/* type de message color */
	.ban {
		background: rgba(195, 40, 40, 0.7);
	}

	.resub {
		background: rgba(37, 149, 200, 0.801);
	}

	.sub {
		background: rgba(43, 170, 229, 0.7);
	}

	.warning {
		background: rgba(206, 142, 41, 0.7);
	}

	.cheers {
		background: rgba(175, 77, 253, 0.7);
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

	.glass {
		background-color: rgba(42, 42, 42, 0.98);
		border-radius: 0.3em;
		padding: 0.2em;
		min-width: 25em;
		margin: 5px 10px;
		color: rgb(255, 255, 255);
	}

	.glass p .username {
		font-size: 0.8em;
		font-size: 200;
	}

	.glass p .message {
		font-size: 1em;
		font-weight: 300;
	}

	.glass:last-child {
		margin-bottom: 10px;
	}

	.glass p {
		margin: 10px;
	}

	/* //////////////////// Theme //////////////////// */

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
