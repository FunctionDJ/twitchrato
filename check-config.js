module.exports = (config, path) => {
  const configError = `${path} in config.json is invalid but required.`;

  const info = path.split(".").reduce((prev, curr) => {
    try {
      return prev[curr];
    } catch {
      throw configError;
    }
  }, config);

  if (!info || typeof info !== "string") {
    throw configError;
  }
};