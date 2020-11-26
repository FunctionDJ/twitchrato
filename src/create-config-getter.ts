export default (config: any) =>
  <T>(path: string, throwOnUndefined = false) => {
    const result: T|undefined = path.split(".").reduce((prev, cur) => {
      return prev?.[cur];
    }, config);

    if (throwOnUndefined && result === undefined) {
      throw `${path} is missing or undefined in config.json, but is required.`;
    }
  
    return result;
  }