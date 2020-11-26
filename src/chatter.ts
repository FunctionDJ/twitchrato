import { Client } from "tmi.js";
import SongState from "./song-state";

export default class Chatter {
  public cooldown = 5; // in seconds
  public currentTemplate = "Now playing: %s";
  public previousTemplate = "Previously played: %s";

  public currentCommand = "!song";
  public previousCommand = "!lastsong";

  private currentCooldown = false;
  private previousCooldown = false;

  constructor(
    private songState: SongState,
    private client: Client,
    private targetChannel: string,
    autopost: boolean
  ) {
    if (autopost) {
      this.songState.subscribe(() => {
        this.trySayCurrent();
      })
    }
  }

  feed(message: string) {
    const normalized = message.toLowerCase().trim();

    if (normalized === this.currentCommand) {
      this.trySayCurrent();
    }

    if (normalized === this.previousCommand) {
      this.trySayPrevious();
    }
  }

  trySayCurrent() {
    if (this.currentCooldown || !this.songState.current) {
      return;
    }

    this.client.say(
      this.targetChannel,
      this.currentTemplate.replace("%s", this.songState.current)
    )

    this.currentCooldown = true;

    setTimeout(() => {
      this.currentCooldown = false;
    }, this.cooldown * 1000);
  }

  trySayPrevious() {
    if (this.previousCooldown || !this.songState.previous) {
      return;
    }

    this.client.say(
      this.targetChannel,
      this.previousTemplate.replace("%s", this.songState.previous)
    )

    this.previousCooldown = true;

    setTimeout(() => {
      this.previousCooldown = false;
    }, this.cooldown * 1000);
  }
}