# twitchrato
Responds to '!song' or '!lastsong' (customizable) commands with the currently playing song from Serato DJ in Twitch chat. twitchrato can also autopost, i.e. post the currently playing song whenever it changes.

### Download: https://github.com/FunctionDJ/twitchrato/releases

### Instructions:
- extract the files into any folder
- open the `config.json` and edit these fields:
  - `seratoUserName` is the name that shows up in the serato live playlists URL
  - `twitch`
    - `userName` is the name of the twitch account that should respond in chat
    - `token` is the authorization token required to log into twitch chat. you can get a token for your own twitch account easily here: https://twitchapps.com/tmi/
    - `targetChannel` is the channel you want to post in, which can be the same as your username, but doesn't have to
- run `twitchrato.exe` :)
### Optional configurations:
  - `debugMode` won't log into twitch chat and post messages (that's all it does right now)
  - `mock` if set to `true`, it won't try to pull from your serato URL and instead update the current song with random names every now and then. this might be useful if you want to try out twitchrato without going live in Serato DJ.
  - `cooldown` is the number of seconds the bot won't respond to a `!song` or `!lastsong` command after it has fulfilled such a request. the timers are seperate for the commands, and are also separate from autoposting.
  - `current-song` / `previous-song`:
    - `command` Which command the bot should listen for in chat
    - `template` The message template. `%s` is replaced by the song title. The template for the current song is also used for autoposting.
    - `txtPath` If you enter a file path, twitchrato will write the current or previous song to that file when it updates. You can use this for OBS Studio for example. It's disabled by default by setting it to `""`.
    - `autopost` (current only) This will automatically post the currently playing song to the chat. It's not affected by any cooldowns. Set to `true` or `false`.

For developers:
- run `npm install` and `npm start` to start the program
- run `npm run build` to build the distributable files in the /build/ folder
- check the `package.json` for all other available scripts
