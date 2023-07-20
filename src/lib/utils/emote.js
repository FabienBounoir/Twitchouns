const parseEmote = (text, emotes) => {
    var splitText = text.split("");
    for (var i in emotes) {
        var e = emotes[i];
        for (var j in e) {
            var mote = e[j];
            if (typeof mote == "string") {
                mote = mote.split("-");
                mote = [parseInt(mote[0]), parseInt(mote[1])];
                var length = mote[1] - mote[0],
                    empty = Array.apply(
                        null,
                        new Array(length + 1)
                    ).map(function () {
                        return "";
                    });
                splitText = splitText
                    .slice(0, mote[0])
                    .concat(empty)
                    .concat(
                        splitText.slice(mote[1] + 1, splitText.length)
                    );
                console.log(
                    '<img class="emote" style="width: 1.5em;"  src="http://static-cdn.jtvnw.net/emoticons/v2/' +
                    i +
                    '/default/dark/3.0" alt="' +
                    i +
                    '">'
                );
                splitText.splice(
                    mote[0],
                    1,
                    '<span ><img class="emote" style="width: 1.5em; vertical-align: bottom;"  src="http://static-cdn.jtvnw.net/emoticons/v2/' +
                    i +
                    '/default/dark/3.0" alt="' +
                    i +
                    '"></span>'
                );
            }
        }
    }
    return splitText.join("");
}

export {
    parseEmote
}