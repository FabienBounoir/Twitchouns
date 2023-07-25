import { writable, get } from 'svelte/store';

import { parseEmote } from '../utils/emote'
import { push, messages } from '$lib/stores/message'
import { badges } from "$lib/stores/badges"
import { randomAvatar } from "$lib/stores/avatar"
import { clip, asVideo } from "$lib/stores/clip"
import messageDebug from "$lib/assets/messages.json"

let msg = []
let clip_ = ""

let regexUrl = /(https?:\/\/[^\s]+)/g;

messages.subscribe(value => {
    msg = value;
})

clip.subscribe(value => {
    clip_ = value;
})

export class Message {
    constructor(config) {
        this.config = config;
        this.eventName = "message";

        if (this.config.debug == "true") {
            messages.set(messageDebug);
        }
    }

    getEventName() {
        return this.eventName;
    }

    async run(channel, tags, message, self) {
        if (tags["message-type"] == "whisper") return;
        if (this.config?.blacklist?.includes(tags["display-name"].toLowerCase())) return;

        let tagsUrl = [];

        if (this.config.badge) {
            if (tags["badges"]) {
                const $badges = get(badges);

                for (let [badgeId, badgeElement] of Object.entries(tags["badges"])) {
                    let badge = $badges?.channels?.[channel.replace("#", "")]?.find((badge) => badge.set_id == badgeId) || $badges?.global?.find((badge) => badge.set_id == badgeId);

                    if (!badge) continue;

                    let badgeVersion = badge.versions.find((version) => version.id == badgeElement);
                    if (!badgeVersion) continue;

                    let url = badgeVersion?.image_url_4x || badgeVersion?.image_url_2x || badgeVersion?.image_url_1x;
                    if (!url) continue;

                    tagsUrl.push(url);
                }
            }
        }

        if (msg.length != 0) {
            randomAvatar();
        }

        if (message.includes("<") && message.includes(">")) {
            if (tags["display-name"].toLowerCase() != "badbounstv") {
                message = message.replace(/</gm, "< ");
            }
        }

        let clipId = extractClipId(message)

        if (clipId) {
            if (asVideo) asVideo.set(false);

            const test =
                "https://cy49zmt23f.execute-api.us-east-1.amazonaws.com/dev/download_clip?id=" +
                clipId;

            try {
                const data = await fetch(test).then((response) =>
                    response.json()
                );

                //link regex replace by clip name
                message = message.replace(/(https?:\/\/[^\s]+)/g, "<u>" + data.data[0].title + "</u>")

                if (channel == "#bounsbot" || (channel == "#" + data.data[0].broadcaster_name.toLowerCase() && this.config.clip == "true")) {
                    console.log(data.data[0].thumbnail_url.split("-preview")[0] + ".mp4");
                    clip.set(data.data[0].thumbnail_url.split("-preview")[0] + ".mp4");
                    asVideo.set(true)
                }
            } catch (erreur) {
                console.log(erreur);
            }
        }
        else if (regexUrl.test(message)) {
            let urls = message.match(regexUrl);

            console.log(urls)

            for (let url of urls) {
                //Fetch title metadata from url
                try {
                    const element = await fetch('/api/infolink?url=' + url).then((response) => response.json());
                    if (!element || (!element.title)) continue;


                    //link regex replace by clip name
                    message = message.replace(url, "<u>" + element.title + "</u>")
                }
                catch (error) {
                    console.log(error);
                    continue;
                }
            }
        }

        let messageJson = {
            message: `${tags.emotes == null
                ? message
                : parseEmote(message, tags.emotes)
                }`,
            username: tags["display-name"],
            type: "tchat",
            tagsUrl,
            color: null
        };

        if (this.config.color) {
            messageJson.color = tags["color"];
        }

        push(messageJson, 15000);
    }
}

const extractClipId = (url) => {
    const regex = /(?:\/clip\/|clips\.twitch\.tv\/)([\w-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
};