const { parse } = require("node-html-parser");

module.exports = htmlString => {
  const document = parse(htmlString);

  const playlistTracks = document.querySelector("#playlist_tracklist");

  if (!playlistTracks) {
    throw "Could not find a tracklist on this page. Maybe you're not live or haven't published the live playlist yet.";
  }

  /** @type {HTMLElement[]} */
  const trackElements = playlistTracks.childNodes.filter(n => n.tagName)

  return trackElements.map(t => ({
    timestamp: t.querySelector(".playlist-timestamp")?.innerText.trim(),
    tracktime: t.querySelector(".playlist-tracktime").innerText.trim(),
    trackname: t.querySelector(".playlist-trackname").innerText.trim()
  }))
}