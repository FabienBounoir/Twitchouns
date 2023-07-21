import { j as json } from "../../../../chunks/index.js";
const GET = async ({ params, url }) => {
  try {
    const clientId = process.env.clientId || "s8d4y51gcfk6ilf8x3auy0rv3f9r10";
    const clientSecret = process.env.clientSecret || "zj3eejbs5si1x4h2rtp8323v1jt4eg";
    if (!process.env.bearerToken) {
      console.log("no token");
      const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: "POST"
      });
      const data2 = await response.json();
      if (response.ok) {
        process.env.bearerToken = data2.access_token;
        console.log(process.env.bearerToken);
      } else {
        console.log("Error:", data2.message);
      }
    }
    let data = await fetch("https://api.twitch.tv/helix/chat/badges/global", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.bearerToken}`,
        "Client-ID": clientId
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Request failed with status code " + response.status);
      }
    });
    console.log(data);
    return json({ ...data });
  } catch (error) {
    console.log(error);
    return json({});
  }
};
export {
  GET
};
