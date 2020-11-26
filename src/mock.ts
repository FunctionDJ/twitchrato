import express from "express";
import getRandomName from "./get-random-name";

export default () => {
  const app = express();

  const songNames: string[] = [];

  app.get("*", (_req, res) => {
    if (Math.random() > 0.3) {
      songNames.push(getRandomName());
    }

    res.send(`
      <html>
        <body>
          <div id='playlist_tracklist'>
            ${
              songNames.map(songName => `
                <div>
                  <div class='playlist-timestamp'></div>
                  <div class='playlist-tracktime'></div>
                  <div class='playlist-trackname'>${songName}</div>
                </div>
              `).join("")
            }
          </div>
        </body>
      </html>
    `)
  })

  app.listen(8000);
}