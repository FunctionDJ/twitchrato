const tmi = require("tmi.js");

module.exports = async (username, token, channel) => {
  /** @type {tmi.Client} */
  const client = new tmi.client({
    channels: [ channel ],
    identity: {
      username,
      password: token
    }
  });

  try {
    await client.connect()
  } catch {
    throw "Could not log into Twitch chat. Are you credentials valid?";
  }

  return client;
}