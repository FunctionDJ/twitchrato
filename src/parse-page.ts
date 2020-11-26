import { parse } from "node-html-parser";

export default (html: string) => {
  const document = parse(html);

  const playlistTracks = document.querySelector("#playlist_tracklist");

  if (!playlistTracks) {
    throw "Could not find a tracklist on this page. Maybe you're not live or haven't published the live playlist yet.";
  }

  const childNodes = playlistTracks.childNodes as any

  const trackElements: HTMLElement[] = childNodes.filter((n: any) => n.tagName)

  return trackElements.map(t => ({
    timestamp: t.querySelector<HTMLElement|null>(".playlist-timestamp")?.innerText.trim(),
    tracktime: t.querySelector<HTMLElement>(".playlist-tracktime").innerText.trim(),
    trackname: t.querySelector<HTMLElement>(".playlist-trackname").innerText.trim()
  }))
}