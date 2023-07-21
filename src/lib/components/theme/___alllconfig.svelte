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
				class={$config.theme}
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
						{#if $config.theme == 'glass'}
							<br />
						{/if}
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

	/* ////////////////////// theme ////////////////////: */

	.white {
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.3);
		/* background: rgba(218, 218, 218, 0.6); */
		background: rgba(199, 199, 199, 0.646);
		box-shadow: 0 8px 12px 0 rgba(31, 38, 135, 0.37);
		text-shadow: 0 2px 4px rgb(0 0 0 / 66%);
		/* text-shadow: 0 2px 4px rgb(71 97 206 / 36%);  */
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

	.flatwhite {
		color: black;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: white;
		box-shadow: 0 5px 8px 0 rgb(31 38 135 / 37%);
	}

	.flatdark {
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background: black;
		box-shadow: 0 5px 8px 0 rgb(31 38 135 / 37%);
	}

	.linearrgb {
		color: white;
		border: 1px solid rgb(255, 255, 255);
		background: linear-gradient(
			-45deg,
			rgba(238, 118, 82, 0.85),
			rgba(231, 60, 126, 0.85),
			rgba(35, 165, 213, 0.85),
			rgba(35, 213, 171, 0.85)
		);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
		box-shadow: 0 5px 8px 0 rgb(31 38 135 / 37%);
	}

	.bluepurple {
		color: white;
		border: 1px solid rgba(11, 4, 213, 0.731);
		background: linear-gradient(-45deg, rgba(35, 165, 213, 0.7), rgba(148, 35, 213, 0.7));
		background-size: 400% 400%;
		animation: gradient 7s ease infinite;
		box-shadow: 0 5px 8px 0 rgb(31 38 135 / 37%);
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
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

	.dark {
		/* color: #101010; */
		border: 1px solid rgba(0, 0, 0, 0.3);
		box-shadow: 0 8px 12px 0 rgba(31, 38, 135, 0.37);
		/* text-shadow: 0 2px 4px rgb(150 155 176 / 36%); */
		/* background: rgb(44, 40, 40, 0.25); */

		/* text-shadow: 0 1px 4px rgb(150 155 176 / 76%); */
		background: rgb(44, 40, 40, 0.6);
		color: #e3dfdf;
		/* background: rgb(100, 100, 100, 0.8); */
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
