import { Client } from "tmi.js";
import Chatter from "./chatter";
import createConfigGetter from "./create-config-getter";
import getTwitchClient from "./get-twitch-client";
import loadConfig from "./load-config";
import mock from "./mock";
import parsePage from "./parse-page";
import SongState from "./song-state";
import Writer from "./writer";
import fetch from "node-fetch";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

(async () => {
  const config = await loadConfig();
  const getConfig = createConfigGetter(config);
  
  let twitchClient: Client;
  
  if (config.mock) {
    mock();
  }

  let chatter: Chatter;

  const songState = new SongState();

  const writer = new Writer(songState);
  writer.currentPath = getConfig("current-song.txtPath");
  writer.previousPath = getConfig("previous-song.txtPath");

  if (!config.debugMode) {
    const targetChannel = getConfig<string>("twitch.targetChannel", true);

    console.log(`Logging into channel twitch.tv/${targetChannel}...`);

    twitchClient = await getTwitchClient(
      getConfig("twitch.userName", true),
      getConfig("twitch.token", true),
      targetChannel
    );

    console.log("Logged in!");

    const autopost = Boolean(getConfig("current-song.autopost"));
    chatter = new Chatter(songState, twitchClient, targetChannel, autopost);
    chatter.currentCommand = getConfig("current-song.command");
    chatter.currentTemplate = getConfig("current-song.template");
    chatter.previousCommand = getConfig("previous-song.command");
    chatter.previousTemplate = getConfig("previous-song.template");
    chatter.cooldown = parseInt(getConfig("cooldown"), 10);

    twitchClient.on("message", (_channel, _tags, message) => {
      chatter.feed(message);
    });
  } else {
    console.log("Skipping login due to debug mode");
  }

  let lastError: string;

  const logAndRetry = async (errorMessage: string) => {
    if (errorMessage !== lastError) {
      console.error(errorMessage);
      lastError = errorMessage;
    }

    console.log("Retrying in 5 seconds...");
    await sleep(5000);
  };

  const seratoUserName = getConfig("seratoUserName", true);

  while (true) {
    let page;
    const url = config.mock ? "http://localhost:8000" : `https://serato.com/playlists/${seratoUserName}/live`;

    try {
      page = await fetch(url);
    } catch (error) {
      const errorMessage = `Could not fetch the live playlist of ${seratoUserName}. Maybe you're offline?`
        + `\n       Attempted URL: ${url}`
        + `\n       Network error message: ${error.message}`;
      await logAndRetry(errorMessage);
      continue;
    }
    
    let tracks;
    try {
      tracks = parsePage(await page.text());
    } catch (error) {
      const errorMessage = error + `\n       Attempted URL: ${url}`;
      await logAndRetry(errorMessage);
      continue;
    }

    const lastTrackElement = tracks[tracks.length - 1];

    if (!lastTrackElement) {
      await logAndRetry("Couldn't find a track on the page yet");
      continue;
    }

    const lastTrack = lastTrackElement.trackname;

    if (lastTrack !== songState.current) {
      console.log(`New song: ${lastTrack}`)
      songState.current = lastTrack;
    }

    await sleep(5000);
  }
})().catch(async e => {
  console.error(`Error: ${e}`)

  if (process.env.NODE_ENV === "development") {
    throw e;
  }
  
  // If we don't keep NodeJS running, the CLI window will close on error
  // and the user won't know what has gone wrong.
  setTimeout(() => {}, 2147483647);
});