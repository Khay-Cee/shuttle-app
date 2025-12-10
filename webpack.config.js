// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-maps'],
      },
    },
    argv
  );

  // Add alias to prevent react-native-maps from being bundled on web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-maps': false,
  };

  return config;
};
