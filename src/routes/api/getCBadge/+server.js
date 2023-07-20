import { json } from "@sveltejs/kit";

export const GET = async ({ params, url }) => {
	try {
		let channel = url?.searchParams.get("channel");
		let broadcaster_id = await getBroadcasterId(channel);
		const clientId = process.env.clientId || "s8d4y51gcfk6ilf8x3auy0rv3f9r10"
		const clientSecret = process.env.clientSecret || "zj3eejbs5si1x4h2rtp8323v1jt4eg"

		if (!process.env.bearerToken) {
			console.log("no token");

			const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
				method: 'POST',
			});

			const data = await response.json();
			if (response.ok) {
				process.env.bearerToken = data.access_token;
				// Use the bearer token for your Twitch API requests
				console.log(process.env.bearerToken);
			} else {
				console.log('Error:', data.message);
			}
		}

		let data = await fetch(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcaster_id}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${process.env.bearerToken}`,
				'Client-ID': clientId
			}
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Request failed with status code ' + response.status);
			}
		})
		console.log(data);

		return json({ ...data });
	} catch (error) {
		console.log(error);
		return json({});
	}
};

const getBroadcasterId = async (channel) => {
	try {
		const clientId = process.env.clientId || "s8d4y51gcfk6ilf8x3auy0rv3f9r10"
		const clientSecret = process.env.clientSecret || "zj3eejbs5si1x4h2rtp8323v1jt4eg"

		if (!process.env.bearerToken) {
			console.log("no token");

			const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
				method: 'POST',
			});

			const data = await response.json();
			if (response.ok) {
				process.env.bearerToken = data.access_token;
				// Use the bearer token for your Twitch API requests
				console.log(process.env.bearerToken);
			} else {
				console.log('Error:', data.message);
			}
		}

		let data = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${process.env.bearerToken}`,
				'Client-ID': clientId
			}
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Request failed with status code ' + response.status);
			}
		})
		console.log(data);

		return data.data[0].id;
	} catch (error) {
		console.log(error);
		return null;
	}

}