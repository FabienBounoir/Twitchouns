import { writable, get } from 'svelte/store';

import fete from "$lib/assets/avatar/fete.png";
import hop from "$lib/assets/avatar/hop.png";
import love from "$lib/assets/avatar/love.png";
import nice from "$lib/assets/avatar/nice.png";
import yo from "$lib/assets/avatar/yo.png";
import ah from "$lib/assets/avatar/ah.png";

// import agacer from "../../assets/avatar/agacer.png";
// import grrr from "../../assets/avatar/grrr.png";
// import explosion from "../../assets/avatar/explosion.png";
// import insulte from "../../assets/avatar/insulte.png";
// import non from "../../assets/avatar/non.png";
// import oups from "../../assets/avatar/oups.png";

import { config } from "./config"


export const avatar = writable("");

export const setAvatar = (AvatarLink) => {
    avatar.set(AvatarLink);
}

export const randomAvatar = () => {
    let $config = get(config);

    console.log($config);

    let image = $config?.customAvatar || [fete, hop, love, nice, yo, ah];

    // if (Date.now() - timestamps > 5000) {
    //     timestamps = Date.now();
    avatar.set(image[Math.floor(Math.random() * image.length)]);
    // }
}