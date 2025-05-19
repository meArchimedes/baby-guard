// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Avoid Node.js module issues
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'mjs'],
  // Ensure any imports for node stdlib modules are ignored for the web build
  blockList: [/\/node_modules\/react-native\/.*\/node_modules\/lodash\/.*/],
  extraNodeModules: {
    // Polyfills for Node.js modules
    stream: require.resolve('readable-stream'),
  }
};

module.exports = config;