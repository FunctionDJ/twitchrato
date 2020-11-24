const getTwitchClient = require("./get-twitch-client");
const parsePage = require("./parse-page");
const checkConfig = require("./check-config");
const getConfig = require("./get-config");
const fetch = require("node-fetch");
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const config = await getConfig();
  
  let twitchClient;
  let lastCachedTrack;

  if (!config.debugMode) {
    checkConfig(config, "twitch.userName");
    checkConfig(config, "twitch.token");
    checkConfig(config, "twitch.targetChannel");
    const { userName, token, targetChannel } = config.twitch;
    console.log(`Logging into channel twitch.tv/${targetChannel}...}`);
    twitchClient = await getTwitchClient(userName, token, targetChannel);
    console.log("Logged in!");

    twitchClient.on("message", (_channel, _tags, message) => {
      if (lastCachedTrack && message.toLowerCase().trim() == "!song") {
        twitchClient.say(targetChannel, `Now playing: ${lastCachedTrack}`)
      }
    })
  } else {
    console.log("Skipping login due to debug mode");
  }

  checkConfig(config, "seratoUserName");

  let lastError;

  const logAndRetry = async errorMessage => {
    if (errorMessage !== lastError) {
      console.error(errorMessage);
      lastError = errorMessage;
    }

    console.log("Retrying in 5 seconds...");
    await sleep(5000);
  };

  while (true) {
    let page;
    // const url = `https://serato.com/playlists/${config.seratoUserName}/live`;
    const url = "https://serato.com/playlists/DJ_MODESTY/the-real-hip-hop-show-n-272";

    try {
      page = await fetch(url);
    } catch (error) {
      const errorMessage = `Could not fetch the live playlist of ${config.seratoUserName}. Maybe you're offline?`
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

    const lastTrack = tracks.slice(-1)[0].trackname;

    if (lastTrack !== lastCachedTrack) {
      console.log(`New song: ${lastTrack}`)
    }

    lastCachedTrack = lastTrack;

    await sleep(5000);
  }
  
})().catch(async e => {
  console.error(`Error: ${e}`)
  // throw e;
  
  // If we don't keep NodeJS running, the CLI window will close on error
  // and the user won't know what has gone wrong.
  setTimeout(() => {}, 2147483647);
});