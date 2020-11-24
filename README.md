# twitchrato
Responds to '!song' commands with the currently playing song in Serato DJ.

Download: https://github.com/FunctionDJ/twitchrato/releases

Instructions:
- extract the files into any folder
- open the config.json and fill in the fields
  - your serato username is the name that shows up in the serato live playlists URL
  - your twitch username is the name of the twitch account that should respond in chat
  - your twitch token is the authorization token required to log into twitch chat. you can get a token for your own twitch account easily here: https://twitchapps.com/tmi/
  - the targetChannel is the channel you want to post in, which can be the same as your username, but doesn't have to
  - debugMode won't log into twitch chat and post messages (that's all it does right now)
- run twitchrato.exe

For developers:
- run `npm install` and `npm start` to start the program
- run `npm run build` to build the distributable files in the /dist/ folder
