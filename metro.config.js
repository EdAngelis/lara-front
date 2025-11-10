const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Point to the new app directory location
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

module.exports = config;
