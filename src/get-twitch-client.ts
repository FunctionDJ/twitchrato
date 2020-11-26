import { Client } from "tmi.js";

export default async (username: string, token: string, channel: string) => {
  const client = Client({
    channels: [ channel ],
    identity: {
      username,
      password: token
    }
  })

  try {
    await client.connect();
  } catch {
    throw "Could not log into Twitch chat. Are your credentials valid?";
  }

  return client;
}