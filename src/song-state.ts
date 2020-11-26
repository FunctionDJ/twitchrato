import { EventEmitter } from "events";

export default class SongState {
  private internalCurrent: string;
  private internalPrevious: string;

  // for autoposting
  private emitter = new EventEmitter();

  get current() {
    return this.internalCurrent;
  }

  set current(newCurrent: string) {
    this.internalPrevious = this.internalCurrent;
    this.internalCurrent = newCurrent;
    this.emitter.emit("newCurrent", newCurrent);
  }

  get previous() {
    return this.internalPrevious;
  }

  set previous(newPrevious: string) {
    this.internalPrevious = newPrevious;
  }

  public subscribe(callback: (...args: any[]) => void) {
    this.emitter.on("newCurrent", callback);
  }
}