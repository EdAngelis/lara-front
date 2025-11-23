// app.config.js
import "dotenv/config";

export default ({ config }) => {
  // merge existing extras from static app.json if present
  const existingExtra = (config && config.extra) || {};

  return {
    ...config,
    extra: {
      // preserve any existing extras
      ...existingExtra,
      // expose both the conventional names your app expects
      // and some commonly used alternative names for compatibility
      BASE_URL:
        process.env.BASE_URL ?? process.env.API_URL ?? existingExtra.BASE_URL,
      API_KEY: process.env.API_KEY ?? existingExtra.API_KEY,
      ENV: process.env.ENV ?? existingExtra.ENV,
    },
  };
};
