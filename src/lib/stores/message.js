import { writable, get } from 'svelte/store';
import { v4 } from "uuid";

import { config } from '$lib/stores/config';

export let messages = writable([]);

/**
 * @type {any[]}
 */
let tchat = [];

messages.subscribe(value => {
    tchat = value;
})

/**
 * 
 * @param {Object} message 
 * @param {Number} time 
 * @returns 
 */
export const push = (message, time = 5000) => {
    const $config = get(config);


    message._id = v4();
    messages.update(n => [...n, message]);

    // console.log(tchat);

    if ($config?.maxMessage && tchat.filter((s) => s.type == "tchat").length > parseInt($config?.maxMessage)) {
        tchat = tchat.slice(tchat.length - parseInt($config?.maxMessage));
        console.log(tchat)
        messages.set(tchat);
    }

    if ($config.save == true) return;

    setTimeout(() => {
        tchat = tchat.filter((s) => s._id !== message._id);
        messages.set(tchat);
    }, time + (parseInt($config?.timeMessage) || 0));
};

/**
 * 
 * @param {String} deletedMessage 
 * @param {String} username 
 */
export const remove = (deletedMessage, username) => {
    tchat = tchat.filter((s) => s.message != deletedMessage && s.username != username);
    messages.set(tchat);
}

// [
//     {
//         "message": "Merci @BadbounsTV pour les 100 bits",
//         "name": "Bits",
//         "type": "cheers",
//         "_id": "c10af171-c4de-4d16-9ef1-e24aba8fb973"
//     },
//     {
//         "message": "@BadbounsTV a été ban !",
//         "name": "Ban",
//         "type": "ban",
//         "_id": "c10af171-c4ded16-9ef1-e24aba8fb973"
//     },
//     {
//         "message": "Attention à ton langage @BadbounsTV",
//         "name": "Warning",
//         "type": "warning",
//         "_id": "c10af171-24aba8fb973"
//     },
//     {
//         "message": "Merci pour le Sub @BadbounsTV",
//         "name": "Sub",
//         "type": "sub",
//         "_id": "c10af1714de-4d16-9ef1-e24aba8fb973"
//     },
//     {
//         "message": "@Badbounst expulsé pour 30 secondes",
//         "name": "Time Out",
//         "type": "ban",
//         "_id": "c10af1714de-4d16-gr-e24aba8fb973"
//     },
//     {
//         "message": "Merci pour le resub @BadbounstV",
//         "name": "Resub 3eme mois",
//         "type": "resub",
//         "_id": "08zefzef-3939-4891-9929-fc9348021e84"
//     },
//     {
//         "message": "wwwwwwwwwwww",
//         "username": "gyunyu_5959",
//         "type": "tchat",
//         "tagsUrl": [],
//         "color": "#0000FF",
//         "_id": "08e78d1f-3939-4891-9929-fc9348021e84"
//     },
//     {
//         "message": "ｗｗ",
//         "username": "ゆみき",
//         "type": "tchat",
//         "tagsUrl": [
//             "https://static-cdn.jtvnw.net/badges/v1/00e214d0-b8dc-4089-8661-3a4fd932a242/3",
//             "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3"
//         ],
//         "color": "#8A2BE2",
//         "_id": "894ba50e-6067-448a-9dac-638659a9cd24"
//     },
//     {
//         "message": "うるーかどうして <span ><img class=\"emote\" style=\"width: 1.5em; vertical-align: bottom;\"  src=\"http://static-cdn.jtvnw.net/emoticons/v2/86/default/dark/3.0\" alt=\"86\"></span>",
//         "username": "ゆみき",
//         "type": "tchat",
//         "tagsUrl": [
//             "https://static-cdn.jtvnw.net/badges/v1/ef525e27-f1c0-4e59-a258-890b52d74773/3",
//             "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3"
//         ],
//         "color": "#DAA520",
//         "_id": "e0df2eb0-c3ed-4cc3-980c-5896a3fba7d7"
//     },
//     {
//         "message": " http://127.0.0.1:5173/chat/badbounstv,bounsbot,romainjacques_?theme=clean&color=true&avatar=false&position=left&events=message,ban,cheer,subscription,subgift,messa effrfgedeleted&maxMessage=15&margin=0,0,0,0&badge=true",
//         "username": "kawasakigg",
//         "type": "tchat",
//         "tagsUrl": [
//             "https://static-cdn.jtvnw.net/badges/v1/b80f038a-0a47-4e24-b48f-63ab7cecbee5/3",
//             "https://static-cdn.jtvnw.net/badges/v1/5864739a-5e58-4623-9450-a2c0555ef90b/3"
//         ],
//         "color": "#0000FF",
//         "_id": "92b222a6-4faa-41e1-919a-20f73cb37a34"
//     },
//     // {
//     //     "message": "うるーか <span ><img class=\"emote\" style=\"width: 1.5em; vertical-align: bottom;\"  src=\"http://static-cdn.jtvnw.net/emoticons/v2/86/default/dark/3.0\" alt=\"86\"></span> <span ><img class=\"emote\" style=\"width: 1.5em; vertical-align: bottom;\"  src=\"http://static-cdn.jtvnw.net/emoticons/v2/86/default/dark/3.0\" alt=\"86\"></span> <span ><img class=\"emote\" style=\"width: 1.5em; vertical-align: bottom;\"  src=\"http://static-cdn.jtvnw.net/emoticons/v2/86/default/dark/3.0\" alt=\"86\"></span>",
//     //     "username": "fdgffghv",
//     //     "type": "tchat",
//     //     "tagsUrl": [],
//     //     "color": null,
//     //     "_id": "d91859b6-4521-489a-9229-d95a91828c8f"
//     // },
//     // {
//     //     "message": "うるーかどうして・・・",
//     //     "username": "jamboreek1",
//     //     "type": "tchat",
//     //     "tagsUrl": [
//     //         "https://static-cdn.jtvnw.net/badges/v1/3a5f7fb4-456c-4c34-b655-502005522735/3",
//     //         "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3"
//     //     ],
//     //     "color": "#0418A5",
//     //     "_id": "0242930d-f850-48d1-aa81-36a2f676e4d8"
//     // },
//     // {
//     //     "message": "うるーか♡",
//     //     "username": "jamboreek1",
//     //     "type": "tchat",
//     //     "tagsUrl": [
//     //         "https://static-cdn.jtvnw.net/badges/v1/3a5f7fb4-456c-4c34-b655-502005522735/3",
//     //         "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3"
//     //     ],
//     //     "color": "#1E90FF",
//     //     "_id": "ab5f1b5e-55fc-4697-ad36-e3cb31fff5fe"
//     // },
//     // {
//     //     "message": "うるーか♡ うるーか♡ うるーか♡ うるーか♡ coucou ca va ? oui et toi ? bonsoir pourquoi pas ...",
//     //     "username": "jamboreek1",
//     //     "type": "tchat",
//     //     "tagsUrl": [
//     //         "https://static-cdn.jtvnw.net/badges/v1/3a5f7fb4-456c-4c34-b655-502005522735/3",
//     //         "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3"
//     //     ],
//     //     "color": "#1E90FF",
//     //     "_id": "ab5f1b5-4697-ad36-e3cb31fff5fe"
//     // },
//     // {
//     //     "message": "うるーか",
//     //     "username": "無色希望",
//     //     "type": "tchat",
//     //     "tagsUrl": [
//     //         "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/3"
//     //     ],
//     //     "color": null,
//     //     "_id": "15bcf338-4eb9-4a59-aa92-823637b76c93"
//     // }
// ]
