import { promises as fs } from "fs";
import { join } from "path";

const configPath = join(process.cwd(), "config.json");

export default async (): Promise<any> => {
  let config, configString;

  try {
    configString = await fs.readFile(configPath, {
      encoding: "utf-8"
    });
  } catch {
    throw `Could not read config.json. Attempted path: ${configPath}`;
  }

  try {
    config = JSON.parse(configString);
  } catch {
    throw "Could not parse config.json. Maybe you made a typo?";
  }

  return config;
}