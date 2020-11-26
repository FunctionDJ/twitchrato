import SongState from "./song-state";
import { promises as fs } from "fs";

export default class Writer {
  public currentPath = ""; // disabled by default
  public previousPath = "";

  constructor(private songState: SongState) {
    songState.subscribe(() => {
      this.tryWriteCurrent();
      this.tryWritePrevious();
    });
  }

  private tryWriteCurrent() {
    if (!this.currentPath || !this.songState.current) {
      return;
    }

    fs.writeFile(this.currentPath, this.songState.current);
  }

  private tryWritePrevious() {
    if (!this.previousPath || !this.songState.previous) {
      return;
    }

    fs.writeFile(this.previousPath, this.songState.previous);
  }
}