const fs = require("fs").promises;
const join = require("path").join;

const configPath = join(process.cwd(), "config.json");

module.exports = async () => {
  let config, configString;
  try {
    configString = await fs.readFile(configPath, { encoding: "utf-8" });
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