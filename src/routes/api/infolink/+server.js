import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

export const GET = async ({ params, url }) => {
	try {
		let urlElement = url?.searchParams.get("url");

		console.log(urlElement);
		const res = await fetch(urlElement).then((res) => res.text());

		let title = res.match(/<title[^>]*>([^<]+)<\/title>/)[1]
		if (title) {
			return json({ title });
		}

		throw new Error("No title found");

	} catch (error) {
		console.log(error);
		return json({ error: "No title found" });
	}
};