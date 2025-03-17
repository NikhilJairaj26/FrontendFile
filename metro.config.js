const { getDefaultConfig } = require('@expo/metro-config');

// Get the default Expo Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Modify the default config with your custom settings
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

defaultConfig.resolver = {
  ...defaultConfig.resolver,
  sourceExts: [...defaultConfig.resolver.sourceExts, 'js', 'jsx', 'ts', 'tsx'], // Add any additional file extensions if needed
};

// Set the Metro server port (this is not part of the Metro config schema)
defaultConfig.server = {
  port: 8082, // Set the default port to 8082
};

module.exports = defaultConfig;