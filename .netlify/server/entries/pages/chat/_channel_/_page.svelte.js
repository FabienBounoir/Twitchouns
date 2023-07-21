import { g as get_store_value, c as create_ssr_component, b as add_attribute, a as subscribe, d as set_store_value, e as escape, n as null_to_empty, f as each, h as add_styles, v as validate_component, m as missing_component } from "../../../../chunks/ssr.js";
import { w as writable } from "../../../../chunks/index2.js";
import { v4 } from "uuid";
import { p as page } from "../../../../chunks/stores.js";
const parseEmote = (text, emotes) => {
  var splitText = text.split("");
  for (var i in emotes) {
    var e = emotes[i];
    for (var j in e) {
      var mote = e[j];
      if (typeof mote == "string") {
        mote = mote.split("-");
        mote = [parseInt(mote[0]), parseInt(mote[1])];
        var length = mote[1] - mote[0], empty = Array.apply(
          null,
          new Array(length + 1)
        ).map(function() {
          return "";
        });
        splitText = splitText.slice(0, mote[0]).concat(empty).concat(
          splitText.slice(mote[1] + 1, splitText.length)
        );
        console.log(
          '<img class="emote" style="width: 1.5em;"  src="http://static-cdn.jtvnw.net/emoticons/v2/' + i + '/default/dark/3.0" alt="' + i + '">'
        );
        splitText.splice(
          mote[0],
          1,
          '<span ><img class="emote" style="width: 1.5em; vertical-align: bottom;"  src="http://static-cdn.jtvnw.net/emoticons/v2/' + i + '/default/dark/3.0" alt="' + i + '"></span>'
        );
      }
    }
  }
  return splitText.join("");
};
const config = writable({
  events: ["message"],
  theme: "light",
  position: "left",
  margin: [0, 0, 0, 0],
  avatar: true,
  badge: true,
  channels: ["badbounstv"],
  save: false,
  maxMessage: 30,
  timeMessage: "0",
  customAvatar: [],
  color: false,
  debug: false
});
let messages = writable([]);
let tchat = [];
messages.subscribe((value) => {
  tchat = value;
});
const push = (message, time = 5e3) => {
  const $config = get_store_value(config);
  message._id = v4();
  messages.update((n) => [...n, message]);
  if ($config?.maxMessage && tchat.filter((s) => s.type == "tchat").length > parseInt($config?.maxMessage)) {
    tchat = tchat.slice(tchat.length - parseInt($config?.maxMessage));
    console.log(tchat);
    messages.set(tchat);
  }
  if ($config.save == true)
    return;
  console.log(message);
  setTimeout(() => {
    tchat = tchat.filter((s) => s._id !== message._id);
    messages.set(tchat);
  }, time + (parseInt($config?.timeMessage) || 0));
};
const remove = (deletedMessage, username) => {
  console.log(`fzfzefzefze`);
  tchat = tchat.filter((s) => s.message != deletedMessage && s.username != username);
  messages.set(tchat);
};
const badges = writable({
  global: null,
  channels: {}
});
const fete = "/_app/immutable/assets/fete.a032e448.png";
const hop = "/_app/immutable/assets/hop.bf0300ed.png";
const love = "/_app/immutable/assets/love.b7b36d38.png";
const nice = "/_app/immutable/assets/nice.96a89ad7.png";
const yo = "/_app/immutable/assets/yo.a10c0bf1.png";
const ah = "/_app/immutable/assets/ah.3cae7849.png";
const avatar = writable("");
const setAvatar = (AvatarLink) => {
  avatar.set(AvatarLink);
};
const randomAvatar = () => {
  let $config = get_store_value(config);
  console.log($config);
  let image = $config?.customAvatar.length > 0 ? $config?.customAvatar : [fete, hop, love, nice, yo, ah];
  avatar.set(image[Math.floor(Math.random() * image.length)]);
};
const clip = writable("");
const asVideo = writable(false);
let msg = [];
messages.subscribe((value) => {
  msg = value;
});
clip.subscribe((value) => {
});
class Message {
  constructor(config2) {
    this.config = config2;
    this.eventName = "message";
  }
  getEventName() {
    return this.eventName;
  }
  async run(channel, tags, message, self) {
    if (tags["message-type"] == "whisper")
      return;
    if (this.config?.blacklist?.split(",").includes(tags["display-name"].toLowerCase()))
      return;
    let tagsUrl = [];
    if (this.config.badge) {
      if (tags["badges"]) {
        const $badges = get_store_value(badges);
        for (let [badgeId, badgeElement] of Object.entries(tags["badges"])) {
          let badge = $badges?.channels?.[channel.replace("#", "")]?.find((badge2) => badge2.set_id == badgeId) || $badges?.global?.find((badge2) => badge2.set_id == badgeId);
          if (!badge)
            continue;
          let badgeVersion = badge.versions.find((version) => version.id == badgeElement);
          if (!badgeVersion)
            continue;
          let url = badgeVersion?.image_url_4x || badgeVersion?.image_url_2x || badgeVersion?.image_url_1x;
          if (!url)
            continue;
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
    let clipId = extractClipId(message);
    if (clipId) {
      if (asVideo)
        asVideo.set(false);
      const test = "https://cy49zmt23f.execute-api.us-east-1.amazonaws.com/dev/download_clip?id=" + clipId;
      try {
        const data = await fetch(test).then(
          (response) => response.json()
        );
        message = message.replace(/(https?:\/\/[^\s]+)/g, "<u>" + data.data[0].title + "</u>");
        if (channel == "#bounsbot" || channel == "#" + data.data[0].broadcaster_name.toLowerCase() && this.config.clip == "true") {
          console.log(data.data[0].thumbnail_url.split("-preview")[0] + ".mp4");
          clip.set(data.data[0].thumbnail_url.split("-preview")[0] + ".mp4");
          asVideo.set(true);
        }
      } catch (erreur) {
        console.log(erreur);
      }
    }
    let messageJson = {
      message: `${tags.emotes == null ? message : parseEmote(message, tags.emotes)}`,
      username: tags["display-name"],
      type: "tchat",
      tagsUrl,
      color: null
    };
    if (this.config.color) {
      messageJson.color = tags["color"];
    }
    push(messageJson, 15e3);
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
class Clearchat {
  constructor(config2) {
    this.config = config2;
    this.eventName = "clearchat";
  }
  getEventName() {
    return this.eventName;
  }
  /**
   * 
   * @param {String} channel 
   */
  async run(channel) {
    console.log("Le tchat a été effacé");
    messages.update((n) => []);
  }
}
const oups = "/_app/immutable/assets/oups.95649315.png";
config.subscribe((value) => {
});
class MessageDeleted {
  constructor(config2) {
    this.config = config2;
    this.eventName = "messagedeleted";
  }
  getEventName() {
    return this.eventName;
  }
  async run(channel, username, deletedMessage, userstate) {
    console.log(`${username} a supprimé son message "${deletedMessage}"`);
    remove(deletedMessage, username);
    if (this.config.events.includes(this.eventName)) {
      setAvatar(oups);
      push({
        message: `Attention à ton langage @${username}`,
        name: "Warning",
        type: "warning"
      });
    }
  }
}
let query$1;
config.subscribe((value) => {
  query$1 = value;
});
class Subscription {
  constructor(config2) {
    this.config = config2;
    this.eventName = "subscription";
  }
  getEventName() {
    return this.eventName;
  }
  async run(channel, username, method, message, userstate) {
    setAvatar(love);
    if (query$1.animsub === "true")
      ;
    console.log("Sub de " + username);
    push(
      {
        message: `Merci pour le Sub @${username}`,
        name: "Sub",
        type: "sub"
      },
      3e4
    );
  }
}
const explosion = "/_app/immutable/assets/explosion.cd1ed6d6.png";
let query;
config.subscribe((value) => {
  query = value;
});
class SubGift {
  constructor(config2) {
    this.config = config2;
    this.eventName = "subgift";
  }
  getEventName() {
    return this.eventName;
  }
  async run(channel, username, numbOfSubs, methods, userstate) {
    ~~userstate["msg-param-sender-count"];
    setAvatar(explosion);
    if (query.animsubgift === "true")
      ;
    console.log(`${username} a offert ${numbOfSubs} sub à la communauté`);
    push(
      {
        message: `Merci @${username} pour ${numbOfSubs > 1 ? `les ${numbOfSubs} sub gift` : "le sub gift"}`,
        name: "Sub Gift",
        type: "sub"
      },
      1e3 * numbOfSubs > 6e4 ? 6e4 : 5e3 * numbOfSubs
    );
  }
}
const events = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Clearchat,
  Message,
  MessageDeleted,
  SubGift,
  Subscription
}, Symbol.toStringTag, { value: "Module" }));
const avatar_svelte_svelte_type_style_lang = "";
const css$b = {
  code: ".avatar.svelte-1pvn0za.svelte-1pvn0za{place-self:flex-end;grid-area:avatar}.avatar.svelte-1pvn0za img.svelte-1pvn0za{width:10em}",
  map: null
};
const Avatar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let actualPicture = "";
  avatar.subscribe((n) => {
    actualPicture = n;
  });
  $$result.css.add(css$b);
  return `<div class="avatar svelte-1pvn0za">  <img${add_attribute("src", actualPicture, 0)} alt=" " class="svelte-1pvn0za">  </div>`;
});
const clip_svelte_svelte_type_style_lang = "";
const css$a = {
  code: ".videoClip.svelte-186mk5g{position:fixed;top:20;left:20;width:30%;object-fit:cover;z-index:1;border-radius:10px;box-shadow:0 0 10px rgba(0, 0, 0, 0.5)}",
  map: null
};
const Clip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $clip, $$unsubscribe_clip;
  let $asVideo, $$unsubscribe_asVideo;
  $$unsubscribe_clip = subscribe(clip, (value) => $clip = value);
  $$unsubscribe_asVideo = subscribe(asVideo, (value) => $asVideo = value);
  $$result.css.add(css$a);
  $$unsubscribe_clip();
  $$unsubscribe_asVideo();
  return `${$clip && $asVideo ? `<video class="videoClip svelte-186mk5g" autoplay muted><source${add_attribute("src", $clip, 0)} type="video/mp4"><track kind="captions"></video>` : ``} `;
});
const dark_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-zipfbx.svelte-zipfbx,.svelte-zipfbx.svelte-zipfbx::after,.svelte-zipfbx.svelte-zipfbx::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-zipfbx.svelte-zipfbx{overflow:hidden;overflow-y:auto;grid-area:text}.Embed.svelte-zipfbx.svelte-zipfbx{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-zipfbx.svelte-zipfbx{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-zipfbx.svelte-zipfbx{grid-area:Bottom}.ban.svelte-zipfbx.svelte-zipfbx{background:rgba(195, 40, 40, 0.7)}.resub.svelte-zipfbx.svelte-zipfbx{background:rgba(37, 149, 200, 0.801)}.sub.svelte-zipfbx.svelte-zipfbx{background:rgba(43, 170, 229, 0.7)}.warning.svelte-zipfbx.svelte-zipfbx{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-zipfbx.svelte-zipfbx{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-zipfbx.svelte-zipfbx{text-align:-webkit-right}.alignLeft.svelte-zipfbx.svelte-zipfbx{text-align:-webkit-left}li.svelte-zipfbx.svelte-zipfbx{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-zipfbx li.svelte-zipfbx{transform-origin:bottom left;text-align:left}.alignRight.svelte-zipfbx li.svelte-zipfbx{transform-origin:bottom right;text-align:right}.dark.svelte-zipfbx.svelte-zipfbx{border:1px solid rgba(0, 0, 0, 0.3);box-shadow:0 8px 12px 0 rgba(31, 38, 135, 0.37);background:rgb(44, 40, 40, 0.6);color:#e3dfdf}.badge.svelte-zipfbx.svelte-zipfbx{margin:0 0 0 0.12em}.badge.svelte-zipfbx.svelte-zipfbx:first-child{margin:0}li.svelte-zipfbx p.svelte-zipfbx{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-zipfbx.svelte-zipfbx{margin-bottom:auto}li.svelte-zipfbx p p.svelte-zipfbx:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-zipfbx.svelte-zipfbx{width:1.5em}.badge.svelte-zipfbx.svelte-zipfbx{width:0.9em}",
  map: null
};
const Dark = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$9);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-zipfbx"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-zipfbx"}">${each($messages, (message) => {
    return `<li class="dark svelte-zipfbx">${message.type == "tchat" ? `<p class="svelte-zipfbx"><span class="badges svelte-zipfbx">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-zipfbx">`;
    })}</span> <b class="username svelte-zipfbx"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-zipfbx"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-zipfbx"><div class="${"top " + escape(message.type, true) + " svelte-zipfbx"}">${escape(message.name)}</div> <div class="bottom svelte-zipfbx"><p class="svelte-zipfbx">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const light_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-1cg1dos.svelte-1cg1dos,.svelte-1cg1dos.svelte-1cg1dos::after,.svelte-1cg1dos.svelte-1cg1dos::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-1cg1dos.svelte-1cg1dos{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-1cg1dos.svelte-1cg1dos{display:none}.Embed.svelte-1cg1dos.svelte-1cg1dos{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-1cg1dos.svelte-1cg1dos{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-1cg1dos.svelte-1cg1dos{grid-area:Bottom}.ban.svelte-1cg1dos.svelte-1cg1dos{background:rgba(195, 40, 40, 0.7)}.resub.svelte-1cg1dos.svelte-1cg1dos{background:rgba(37, 149, 200, 0.801)}.sub.svelte-1cg1dos.svelte-1cg1dos{background:rgba(43, 170, 229, 0.7)}.warning.svelte-1cg1dos.svelte-1cg1dos{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-1cg1dos.svelte-1cg1dos{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-1cg1dos.svelte-1cg1dos{text-align:-webkit-right}.alignLeft.svelte-1cg1dos.svelte-1cg1dos{text-align:-webkit-left}li.svelte-1cg1dos.svelte-1cg1dos{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-1cg1dos li.svelte-1cg1dos{transform-origin:bottom left;text-align:left}.alignRight.svelte-1cg1dos li.svelte-1cg1dos{transform-origin:bottom right;text-align:right}.light.svelte-1cg1dos.svelte-1cg1dos{color:#fff;border:1px solid rgba(255, 255, 255, 0.3);background:rgba(199, 199, 199, 0.646);box-shadow:0 8px 12px 0 rgba(31, 38, 135, 0.37);text-shadow:0 2px 4px rgb(0 0 0 / 66%)}.username.svelte-1cg1dos.svelte-1cg1dos{text-shadow:0 1px 2px var(--color, rgb(0 0 0 / 66%));color:var(--color)}.badge.svelte-1cg1dos.svelte-1cg1dos{margin:0 0 0 0.12em}.badge.svelte-1cg1dos.svelte-1cg1dos:first-child{margin:0}li.svelte-1cg1dos p.svelte-1cg1dos{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-1cg1dos.svelte-1cg1dos{margin-bottom:auto}li.svelte-1cg1dos p p.svelte-1cg1dos:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-1cg1dos.svelte-1cg1dos{width:1.5em}.badge.svelte-1cg1dos.svelte-1cg1dos{width:0.9em}",
  map: null
};
const Light = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$8);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-1cg1dos"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-1cg1dos"}">${each($messages, (message) => {
    return `<li class="light svelte-1cg1dos"${add_styles({ "--color": message.color })}>${message.type == "tchat" ? `<p class="svelte-1cg1dos"><span class="badges svelte-1cg1dos">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-1cg1dos">`;
    })}</span> <b class="username svelte-1cg1dos">${escape(message.username)}:</b> <span class="message svelte-1cg1dos"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-1cg1dos"><div class="${"top " + escape(message.type, true) + " svelte-1cg1dos"}">${escape(message.name)}</div> <div class="bottom svelte-1cg1dos"><p class="svelte-1cg1dos">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const glass_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.glass.svelte-16zd9vd p .username.svelte-16zd9vd{font-size:0.8em;font-weight:normal}.glass.svelte-16zd9vd p .badge.svelte-16zd9vd{vertical-align:middle}.svelte-16zd9vd.svelte-16zd9vd,.svelte-16zd9vd.svelte-16zd9vd::after,.svelte-16zd9vd.svelte-16zd9vd::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-16zd9vd.svelte-16zd9vd{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-16zd9vd.svelte-16zd9vd{display:none}.Embed.svelte-16zd9vd.svelte-16zd9vd{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-16zd9vd.svelte-16zd9vd{grid-area:Top;padding:10px 20px 10px 20px;border-radius:0.3em;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-16zd9vd.svelte-16zd9vd{grid-area:Bottom}.ban.svelte-16zd9vd.svelte-16zd9vd{background:rgba(195, 40, 40, 0.7)}.resub.svelte-16zd9vd.svelte-16zd9vd{background:rgba(37, 149, 200, 0.801)}.sub.svelte-16zd9vd.svelte-16zd9vd{background:rgba(43, 170, 229, 0.7)}.warning.svelte-16zd9vd.svelte-16zd9vd{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-16zd9vd.svelte-16zd9vd{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-16zd9vd.svelte-16zd9vd{text-align:-webkit-right}.alignLeft.svelte-16zd9vd.svelte-16zd9vd{text-align:-webkit-left}li.svelte-16zd9vd.svelte-16zd9vd{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-16zd9vd li.svelte-16zd9vd{transform-origin:bottom left;text-align:left}.alignRight.svelte-16zd9vd li.svelte-16zd9vd{transform-origin:bottom right;text-align:right}.glass.svelte-16zd9vd.svelte-16zd9vd{background-color:rgba(42, 42, 42, 0.98);border-radius:0.3em;padding:0.2em;min-width:25em;margin:5px 10px;color:rgb(255, 255, 255)}.glass.svelte-16zd9vd p .username.svelte-16zd9vd{font-size:0.8em;font-size:200}.glass.svelte-16zd9vd p .message.svelte-16zd9vd{font-size:1em;font-weight:300}.glass.svelte-16zd9vd.svelte-16zd9vd:last-child{margin-bottom:10px}.glass.svelte-16zd9vd p.svelte-16zd9vd{margin:10px}.badge.svelte-16zd9vd.svelte-16zd9vd{margin:0 0 0 0.12em}.badge.svelte-16zd9vd.svelte-16zd9vd:first-child{margin:0}li.svelte-16zd9vd p.svelte-16zd9vd{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-16zd9vd.svelte-16zd9vd{margin-bottom:auto}li.svelte-16zd9vd p p.svelte-16zd9vd:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-16zd9vd.svelte-16zd9vd{width:1.5em}.badge.svelte-16zd9vd.svelte-16zd9vd{width:0.9em}",
  map: null
};
const Glass = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$7);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-16zd9vd"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-16zd9vd"}">${each($messages, (message) => {
    return `<li class="glass svelte-16zd9vd">${message.type == "tchat" ? `<p class="svelte-16zd9vd"><span class="badges svelte-16zd9vd">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-16zd9vd">`;
    })}</span> <b class="username svelte-16zd9vd"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <br class="svelte-16zd9vd"> <span class="message svelte-16zd9vd"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-16zd9vd"><div class="${"top " + escape(message.type, true) + " svelte-16zd9vd"}">${escape(message.name)}</div> <div class="bottom svelte-16zd9vd"><p class="svelte-16zd9vd">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const flatwhite_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-1eblwr.svelte-1eblwr,.svelte-1eblwr.svelte-1eblwr::after,.svelte-1eblwr.svelte-1eblwr::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-1eblwr.svelte-1eblwr{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-1eblwr.svelte-1eblwr{display:none}.Embed.svelte-1eblwr.svelte-1eblwr{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-1eblwr.svelte-1eblwr{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-1eblwr.svelte-1eblwr{grid-area:Bottom}.ban.svelte-1eblwr.svelte-1eblwr{background:rgba(195, 40, 40, 0.7)}.resub.svelte-1eblwr.svelte-1eblwr{background:rgba(37, 149, 200, 0.801)}.sub.svelte-1eblwr.svelte-1eblwr{background:rgba(43, 170, 229, 0.7)}.warning.svelte-1eblwr.svelte-1eblwr{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-1eblwr.svelte-1eblwr{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-1eblwr.svelte-1eblwr{text-align:-webkit-right}.alignLeft.svelte-1eblwr.svelte-1eblwr{text-align:-webkit-left}li.svelte-1eblwr.svelte-1eblwr{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-1eblwr li.svelte-1eblwr{transform-origin:bottom left;text-align:left}.alignRight.svelte-1eblwr li.svelte-1eblwr{transform-origin:bottom right;text-align:right}.flatwhite.svelte-1eblwr.svelte-1eblwr{color:black;border:1px solid rgba(255, 255, 255, 0.3);background:white;box-shadow:0 5px 8px 0 rgb(31 38 135 / 37%)}.badge.svelte-1eblwr.svelte-1eblwr{margin:0 0 0 0.12em}.badge.svelte-1eblwr.svelte-1eblwr:first-child{margin:0}li.svelte-1eblwr p.svelte-1eblwr{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-1eblwr.svelte-1eblwr{margin-bottom:auto}li.svelte-1eblwr p p.svelte-1eblwr:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-1eblwr.svelte-1eblwr{width:1.5em}.badge.svelte-1eblwr.svelte-1eblwr{width:0.9em}",
  map: null
};
const Flatwhite = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$6);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-1eblwr"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-1eblwr"}">${each($messages, (message) => {
    return `<li class="flatwhite svelte-1eblwr">${message.type == "tchat" ? `<p class="svelte-1eblwr"><span class="badges svelte-1eblwr">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-1eblwr">`;
    })}</span> <b class="username svelte-1eblwr"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-1eblwr"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-1eblwr"><div class="${"top " + escape(message.type, true) + " svelte-1eblwr"}">${escape(message.name)}</div> <div class="bottom svelte-1eblwr"><p class="svelte-1eblwr">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const flatdark_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-1cqvfw8.svelte-1cqvfw8,.svelte-1cqvfw8.svelte-1cqvfw8::after,.svelte-1cqvfw8.svelte-1cqvfw8::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-1cqvfw8.svelte-1cqvfw8{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-1cqvfw8.svelte-1cqvfw8{display:none}.Embed.svelte-1cqvfw8.svelte-1cqvfw8{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-1cqvfw8.svelte-1cqvfw8{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-1cqvfw8.svelte-1cqvfw8{grid-area:Bottom}.ban.svelte-1cqvfw8.svelte-1cqvfw8{background:rgba(195, 40, 40, 0.7)}.resub.svelte-1cqvfw8.svelte-1cqvfw8{background:rgba(37, 149, 200, 0.801)}.sub.svelte-1cqvfw8.svelte-1cqvfw8{background:rgba(43, 170, 229, 0.7)}.warning.svelte-1cqvfw8.svelte-1cqvfw8{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-1cqvfw8.svelte-1cqvfw8{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-1cqvfw8.svelte-1cqvfw8{text-align:-webkit-right}.alignLeft.svelte-1cqvfw8.svelte-1cqvfw8{text-align:-webkit-left}li.svelte-1cqvfw8.svelte-1cqvfw8{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-1cqvfw8 li.svelte-1cqvfw8{transform-origin:bottom left;text-align:left}.alignRight.svelte-1cqvfw8 li.svelte-1cqvfw8{transform-origin:bottom right;text-align:right}.flatdark.svelte-1cqvfw8.svelte-1cqvfw8{color:white;border:1px solid rgba(255, 255, 255, 0.3);background:black;box-shadow:0 5px 8px 0 rgb(31 38 135 / 37%)}.badge.svelte-1cqvfw8.svelte-1cqvfw8{margin:0 0 0 0.12em}.badge.svelte-1cqvfw8.svelte-1cqvfw8:first-child{margin:0}li.svelte-1cqvfw8 p.svelte-1cqvfw8{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-1cqvfw8.svelte-1cqvfw8{margin-bottom:auto}li.svelte-1cqvfw8 p p.svelte-1cqvfw8:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-1cqvfw8.svelte-1cqvfw8{width:1.5em}.badge.svelte-1cqvfw8.svelte-1cqvfw8{width:0.9em}",
  map: null
};
const Flatdark = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$5);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-1cqvfw8"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-1cqvfw8"}">${each($messages, (message) => {
    return `<li class="flatdark svelte-1cqvfw8">${message.type == "tchat" ? `<p class="svelte-1cqvfw8"><span class="badges svelte-1cqvfw8">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-1cqvfw8">`;
    })}</span> <b class="username svelte-1cqvfw8"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-1cqvfw8"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-1cqvfw8"><div class="${"top " + escape(message.type, true) + " svelte-1cqvfw8"}">${escape(message.name)}</div> <div class="bottom svelte-1cqvfw8"><p class="svelte-1cqvfw8">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const linearrgb_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-1o3a6ge.svelte-1o3a6ge,.svelte-1o3a6ge.svelte-1o3a6ge::after,.svelte-1o3a6ge.svelte-1o3a6ge::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-1o3a6ge.svelte-1o3a6ge{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-1o3a6ge.svelte-1o3a6ge{display:none}.Embed.svelte-1o3a6ge.svelte-1o3a6ge{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-1o3a6ge.svelte-1o3a6ge{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-1o3a6ge.svelte-1o3a6ge{grid-area:Bottom}.ban.svelte-1o3a6ge.svelte-1o3a6ge{background:rgba(195, 40, 40, 0.7)}.resub.svelte-1o3a6ge.svelte-1o3a6ge{background:rgba(37, 149, 200, 0.801)}.sub.svelte-1o3a6ge.svelte-1o3a6ge{background:rgba(43, 170, 229, 0.7)}.warning.svelte-1o3a6ge.svelte-1o3a6ge{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-1o3a6ge.svelte-1o3a6ge{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-1o3a6ge.svelte-1o3a6ge{text-align:-webkit-right}.alignLeft.svelte-1o3a6ge.svelte-1o3a6ge{text-align:-webkit-left}li.svelte-1o3a6ge.svelte-1o3a6ge{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-1o3a6ge li.svelte-1o3a6ge{transform-origin:bottom left;text-align:left}.alignRight.svelte-1o3a6ge li.svelte-1o3a6ge{transform-origin:bottom right;text-align:right}.linearrgb.svelte-1o3a6ge.svelte-1o3a6ge{color:white;border:1px solid rgb(255, 255, 255);background:linear-gradient(\n			-45deg,\n			rgba(238, 118, 82, 0.85),\n			rgba(231, 60, 126, 0.85),\n			rgba(35, 165, 213, 0.85),\n			rgba(35, 213, 171, 0.85)\n		);background-size:400% 400%;animation:svelte-1o3a6ge-gradient 15s ease infinite;box-shadow:0 5px 8px 0 rgb(31 38 135 / 37%)}@keyframes svelte-1o3a6ge-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.badge.svelte-1o3a6ge.svelte-1o3a6ge{margin:0 0 0 0.12em}.badge.svelte-1o3a6ge.svelte-1o3a6ge:first-child{margin:0}li.svelte-1o3a6ge p.svelte-1o3a6ge{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-1o3a6ge.svelte-1o3a6ge{margin-bottom:auto}li.svelte-1o3a6ge p p.svelte-1o3a6ge:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-1o3a6ge.svelte-1o3a6ge{width:1.5em}.badge.svelte-1o3a6ge.svelte-1o3a6ge{width:0.9em}",
  map: null
};
const Linearrgb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$4);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-1o3a6ge"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-1o3a6ge"}">${each($messages, (message) => {
    return `<li class="linearrgb svelte-1o3a6ge">${message.type == "tchat" ? `<p class="svelte-1o3a6ge"><span class="badges svelte-1o3a6ge">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-1o3a6ge">`;
    })}</span> <b class="username svelte-1o3a6ge"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-1o3a6ge"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-1o3a6ge"><div class="${"top " + escape(message.type, true) + " svelte-1o3a6ge"}">${escape(message.name)}</div> <div class="bottom svelte-1o3a6ge"><p class="svelte-1o3a6ge">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const bluepurple_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-s335lo.svelte-s335lo,.svelte-s335lo.svelte-s335lo::after,.svelte-s335lo.svelte-s335lo::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-s335lo.svelte-s335lo{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-s335lo.svelte-s335lo{display:none}.Embed.svelte-s335lo.svelte-s335lo{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-s335lo.svelte-s335lo{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-s335lo.svelte-s335lo{grid-area:Bottom}.ban.svelte-s335lo.svelte-s335lo{background:rgba(195, 40, 40, 0.7)}.resub.svelte-s335lo.svelte-s335lo{background:rgba(37, 149, 200, 0.801)}.sub.svelte-s335lo.svelte-s335lo{background:rgba(43, 170, 229, 0.7)}.warning.svelte-s335lo.svelte-s335lo{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-s335lo.svelte-s335lo{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-s335lo.svelte-s335lo{text-align:-webkit-right}.alignLeft.svelte-s335lo.svelte-s335lo{text-align:-webkit-left}li.svelte-s335lo.svelte-s335lo{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-s335lo li.svelte-s335lo{transform-origin:bottom left;text-align:left}.alignRight.svelte-s335lo li.svelte-s335lo{transform-origin:bottom right;text-align:right}.bluepurple.svelte-s335lo.svelte-s335lo{color:white;border:1px solid rgba(11, 4, 213, 0.731);background:linear-gradient(-45deg, rgba(35, 165, 213, 0.7), rgba(148, 35, 213, 0.7));background-size:400% 400%;animation:svelte-s335lo-gradient 7s ease infinite;box-shadow:0 5px 8px 0 rgb(31 38 135 / 37%)}@keyframes svelte-s335lo-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.badge.svelte-s335lo.svelte-s335lo{margin:0 0 0 0.12em}.badge.svelte-s335lo.svelte-s335lo:first-child{margin:0}li.svelte-s335lo p.svelte-s335lo{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-s335lo.svelte-s335lo{margin-bottom:auto}li.svelte-s335lo p p.svelte-s335lo:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-s335lo.svelte-s335lo{width:1.5em}.badge.svelte-s335lo.svelte-s335lo{width:0.9em}",
  map: null
};
const Bluepurple = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$3);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-s335lo"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-s335lo"}">${each($messages, (message) => {
    return `<li class="bluepurple svelte-s335lo">${message.type == "tchat" ? `<p class="svelte-s335lo"><span class="badges svelte-s335lo">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-s335lo">`;
    })}</span> <b class="username svelte-s335lo"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-s335lo"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-s335lo"><div class="${"top " + escape(message.type, true) + " svelte-s335lo"}">${escape(message.name)}</div> <div class="bottom svelte-s335lo"><p class="svelte-s335lo">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const rgb_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-1rac7ta.svelte-1rac7ta,.svelte-1rac7ta.svelte-1rac7ta::after,.svelte-1rac7ta.svelte-1rac7ta::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-1rac7ta.svelte-1rac7ta{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-1rac7ta.svelte-1rac7ta{display:none}.Embed.svelte-1rac7ta.svelte-1rac7ta{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-1rac7ta.svelte-1rac7ta{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-1rac7ta.svelte-1rac7ta{grid-area:Bottom}.ban.svelte-1rac7ta.svelte-1rac7ta{background:rgba(195, 40, 40, 0.7)}.resub.svelte-1rac7ta.svelte-1rac7ta{background:rgba(37, 149, 200, 0.801)}.sub.svelte-1rac7ta.svelte-1rac7ta{background:rgba(43, 170, 229, 0.7)}.warning.svelte-1rac7ta.svelte-1rac7ta{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-1rac7ta.svelte-1rac7ta{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-1rac7ta.svelte-1rac7ta{text-align:-webkit-right}.alignLeft.svelte-1rac7ta.svelte-1rac7ta{text-align:-webkit-left}li.svelte-1rac7ta.svelte-1rac7ta{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-1rac7ta li.svelte-1rac7ta{transform-origin:bottom left;text-align:left}.alignRight.svelte-1rac7ta li.svelte-1rac7ta{transform-origin:bottom right;text-align:right}.rgb.svelte-1rac7ta.svelte-1rac7ta{color:#fff;border:1px solid rgba(255, 255, 255, 0.3);background:rgba(199, 199, 199, 0.646);box-shadow:0 8px 12px 0 rgba(31, 38, 135, 0.37);text-shadow:0 2px 4px rgb(0 0 0 / 66%);background-color:rgba(255, 0, 0, 0.6);animation:svelte-1rac7ta-RGBWhiteMode 5s infinite linear}@keyframes svelte-1rac7ta-RGBWhiteMode{0%{background-color:rgba(193, 0, 0, 0.6)}12.5%{background-color:rgba(176, 58, 46, 0.6)}25%{background-color:rgba(175, 96, 26, 0.6)}37.5%{background-color:rgba(183, 149, 11, 0.6)}50%{background-color:rgba(35, 155, 86, 0.6)}62.5%{background-color:rgba(40, 116, 166, 0.6)}75%{background-color:rgba(31, 97, 141, 0.6)}87.5%{background-color:rgba(108, 52, 131, 0.6)}100%{background-color:rgba(193, 0, 0, 0.6)}}.badge.svelte-1rac7ta.svelte-1rac7ta{margin:0 0 0 0.12em}.badge.svelte-1rac7ta.svelte-1rac7ta:first-child{margin:0}li.svelte-1rac7ta p.svelte-1rac7ta{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-1rac7ta.svelte-1rac7ta{margin-bottom:auto}li.svelte-1rac7ta p p.svelte-1rac7ta:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-1rac7ta.svelte-1rac7ta{width:1.5em}.badge.svelte-1rac7ta.svelte-1rac7ta{width:0.9em}",
  map: null
};
const Rgb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$2);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-1rac7ta"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-1rac7ta"}">${each($messages, (message) => {
    return `<li class="rgb svelte-1rac7ta">${message.type == "tchat" ? `<p class="svelte-1rac7ta"><span class="badges svelte-1rac7ta">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-1rac7ta">`;
    })}</span> <b class="username svelte-1rac7ta"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-1rac7ta"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-1rac7ta"><div class="${"top " + escape(message.type, true) + " svelte-1rac7ta"}">${escape(message.name)}</div> <div class="bottom svelte-1rac7ta"><p class="svelte-1rac7ta">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const maxime_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-1rac7ta.svelte-1rac7ta,.svelte-1rac7ta.svelte-1rac7ta::after,.svelte-1rac7ta.svelte-1rac7ta::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}.textfields.svelte-1rac7ta.svelte-1rac7ta{overflow:hidden;overflow-y:auto;grid-area:text}.none.svelte-1rac7ta.svelte-1rac7ta{display:none}.Embed.svelte-1rac7ta.svelte-1rac7ta{display:grid;grid-template-areas:'Top'\n			'Bottom'}.top.svelte-1rac7ta.svelte-1rac7ta{grid-area:Top;padding:10px 20px 10px 20px;border-radius:10px 10px 0px 0px;text-align:left;font-weight:bold;letter-spacing:1px}.bottom.svelte-1rac7ta.svelte-1rac7ta{grid-area:Bottom}.ban.svelte-1rac7ta.svelte-1rac7ta{background:rgba(195, 40, 40, 0.7)}.resub.svelte-1rac7ta.svelte-1rac7ta{background:rgba(37, 149, 200, 0.801)}.sub.svelte-1rac7ta.svelte-1rac7ta{background:rgba(43, 170, 229, 0.7)}.warning.svelte-1rac7ta.svelte-1rac7ta{background:rgba(206, 142, 41, 0.7)}.cheers.svelte-1rac7ta.svelte-1rac7ta{background:rgba(175, 77, 253, 0.7)}.alignRight.svelte-1rac7ta.svelte-1rac7ta{text-align:-webkit-right}.alignLeft.svelte-1rac7ta.svelte-1rac7ta{text-align:-webkit-left}li.svelte-1rac7ta.svelte-1rac7ta{list-style-type:none;margin:10px;font-style:normal;font-weight:500;font-size:20px;line-height:23px;width:max-content;max-width:25em;border-radius:10px}.alignLeft.svelte-1rac7ta li.svelte-1rac7ta{transform-origin:bottom left;text-align:left}.alignRight.svelte-1rac7ta li.svelte-1rac7ta{transform-origin:bottom right;text-align:right}.rgb.svelte-1rac7ta.svelte-1rac7ta{color:#fff;border:1px solid rgba(255, 255, 255, 0.3);background:rgba(199, 199, 199, 0.646);box-shadow:0 8px 12px 0 rgba(31, 38, 135, 0.37);text-shadow:0 2px 4px rgb(0 0 0 / 66%);background-color:rgba(255, 0, 0, 0.6);animation:svelte-1rac7ta-RGBWhiteMode 5s infinite linear}@keyframes svelte-1rac7ta-RGBWhiteMode{0%{background-color:rgba(193, 0, 0, 0.6)}12.5%{background-color:rgba(176, 58, 46, 0.6)}25%{background-color:rgba(175, 96, 26, 0.6)}37.5%{background-color:rgba(183, 149, 11, 0.6)}50%{background-color:rgba(35, 155, 86, 0.6)}62.5%{background-color:rgba(40, 116, 166, 0.6)}75%{background-color:rgba(31, 97, 141, 0.6)}87.5%{background-color:rgba(108, 52, 131, 0.6)}100%{background-color:rgba(193, 0, 0, 0.6)}}.badge.svelte-1rac7ta.svelte-1rac7ta{margin:0 0 0 0.12em}.badge.svelte-1rac7ta.svelte-1rac7ta:first-child{margin:0}li.svelte-1rac7ta p.svelte-1rac7ta{margin:10px 20px 10px 20px;font-weight:350;align-items:center;word-wrap:break-word}b.svelte-1rac7ta.svelte-1rac7ta{margin-bottom:auto}li.svelte-1rac7ta p p.svelte-1rac7ta:first-child{margin:10px 20px 10px 20px;font-weight:300;align-items:center;display:flex;font-weight:bold}.emote.svelte-1rac7ta.svelte-1rac7ta{width:1.5em}.badge.svelte-1rac7ta.svelte-1rac7ta{width:0.9em}",
  map: null
};
const Maxime = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  set_store_value(config, $config = get_store_value(config), $config);
  $$result.css.add(css$1);
  $$unsubscribe_config();
  $$unsubscribe_messages();
  return `<div class="textfields svelte-1rac7ta"><ul class="${escape(null_to_empty($config.position === "left" ? "alignLeft" : "alignRight"), true) + " svelte-1rac7ta"}">${each($messages, (message) => {
    return `<li class="${escape(null_to_empty($config.theme), true) + " svelte-1rac7ta"}">${message.type == "tchat" ? `<p class="svelte-1rac7ta"><span class="badges svelte-1rac7ta">${each(message.tagsUrl, (badge) => {
      return `<img${add_attribute("src", badge, 0)} alt=" " class="badge svelte-1rac7ta">`;
    })}</span> <b class="username svelte-1rac7ta"${add_attribute("style", message.color ? "color: " + message.color : "", 0)}>${escape(message.username)}:</b> <span class="message svelte-1rac7ta"><!-- HTML_TAG_START -->${message.message}<!-- HTML_TAG_END --></span> </p>` : `<div class="Embed svelte-1rac7ta"><div class="${"top " + escape(message.type, true) + " svelte-1rac7ta"}">${escape(message.name)}</div> <div class="bottom svelte-1rac7ta"><p class="svelte-1rac7ta">${escape(message.message)}</p></div> </div>`} </li>`;
  })}</ul> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ":root{font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,\n			'Open Sans', 'Helvetica Neue', sans-serif}.svelte-z9wynk,.svelte-z9wynk::after,.svelte-z9wynk::before{margin:0;padding:0;box-sizing:border-box}body{overflow:hidden;overflow-x:hidden}div#saver.svelte-z9wynk{position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover}.gridApp.svelte-z9wynk{display:grid;grid-template-areas:'text avatar';position:absolute}.gridRight.svelte-z9wynk{grid-template-areas:'text avatar';right:0;bottom:0}.gridLeft.svelte-z9wynk{grid-template-areas:'avatar text';left:0;bottom:0}@keyframes svelte-z9wynk-gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}@keyframes svelte-z9wynk-RGBWhiteMode{0%{background-color:rgba(193, 0, 0, 0.6)}12.5%{background-color:rgba(176, 58, 46, 0.6)}25%{background-color:rgba(175, 96, 26, 0.6)}37.5%{background-color:rgba(183, 149, 11, 0.6)}50%{background-color:rgba(35, 155, 86, 0.6)}62.5%{background-color:rgba(40, 116, 166, 0.6)}75%{background-color:rgba(31, 97, 141, 0.6)}87.5%{background-color:rgba(108, 52, 131, 0.6)}100%{background-color:rgba(193, 0, 0, 0.6)}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $badges, $$unsubscribe_badges;
  let $config, $$unsubscribe_config;
  let $messages, $$unsubscribe_messages;
  let $page, $$unsubscribe_page;
  $$unsubscribe_badges = subscribe(badges, (value) => $badges = value);
  $$unsubscribe_config = subscribe(config, (value) => $config = value);
  $$unsubscribe_messages = subscribe(messages, (value) => $messages = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  set_store_value(config, $config.channels = $page.params.channel.split(","), $config);
  location.search.split(/[?&]/g).reduce(
    (a, pair) => {
      if (!pair.trim())
        return a;
      const [key, value] = pair.split("=");
      set_store_value(config, $config[key] = value.includes(",") ? value.split(",") : value, $config);
      return a;
    },
    {}
  );
  console.log($config);
  const client = new tmi.Client({
    options: { debug: false },
    connection: { secure: true, reconnect: true },
    channels: $config?.channels || ["badbounstv"]
  });
  client.connect();
  set_store_value(messages, $messages = get_store_value(messages), $messages);
  for (let event of Object.values(events)) {
    console.log(event);
    let eventInit = new event($config);
    console.log(eventInit.getEventName());
    if ($config.events.includes(eventInit.getEventName()) || ["clearchat", "messagedeleted"].includes(eventInit.getEventName())) {
      console.log("add " + eventInit.getEventName());
      client.on(eventInit.getEventName(), (...args) => eventInit.run(...args));
    } else {
      console.log("continue " + eventInit.getEventName());
      continue;
    }
  }
  const getGBadge = async () => {
    const res = await fetch("/api/getGBadge");
    const data = await res.json();
    console.log(data);
    if (data && data.data && data.data.length > 0) {
      set_store_value(badges, $badges.global = data.data, $badges);
    }
  };
  const getCBadge = async () => {
    let channels = $config?.channels;
    for (let channel of channels) {
      console.log(channel);
      const res = await fetch("/api/getCBadge?channel=" + channel.replace("#", ""));
      const data = await res.json();
      console.log(data);
      if (data && data.data && data.data.length > 0) {
        set_store_value(badges, $badges.channels[channel.replace("#", "")] = data.data, $badges);
      }
    }
  };
  getGBadge();
  getCBadge();
  randomAvatar();
  setTimeout(
    () => {
      console.log($badges);
    },
    1e4
  );
  const components = {
    dark: Dark,
    light: Light,
    glass: Glass,
    flatwhite: Flatwhite,
    flatdark: Flatdark,
    linearrgb: Linearrgb,
    bluepurple: Bluepurple,
    rgb: Rgb,
    maxime: Maxime
  };
  $$result.css.add(css);
  $$unsubscribe_badges();
  $$unsubscribe_config();
  $$unsubscribe_messages();
  $$unsubscribe_page();
  return `${$config.debug ? `<pre style="position: absolute;" class="svelte-z9wynk">${escape(JSON.stringify($config, null, 2))}</pre>` : ``} <main class="svelte-z9wynk"><div id="saver" class="svelte-z9wynk"> <div class="${"gridApp " + escape($config.position === "left" ? "gridLeft" : "gridRight", true) + " svelte-z9wynk"}" style="${"margin-bottom: " + escape($config.margin[2], true) + "px; margin-top: " + escape($config.margin[0], true) + "px; margin-left: " + escape($config.margin[3], true) + "px; margin-right: " + escape($config.margin[1], true) + "px;"}">${validate_component(components[$config.theme] || missing_component, "svelte:component").$$render($$result, {}, {}, {})} ${$config.avatar != null ? `${$messages.length ? `${validate_component(Avatar, "Avatar").$$render($$result, {}, {}, {})}` : ``}` : ``}</div></div> ${validate_component(Clip, "Clip").$$render($$result, {}, {}, {})} </main>`;
});
export {
  Page as default
};
