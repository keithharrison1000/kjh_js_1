const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const loadPresets = require("./build-utils/loadPresets");
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);


module.exports = ({ mode = 'production', presets = [] }) =>{
//return modeConfig(mode)

  
 return webpackMerge({
  mode,
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  output: { path: path.join(__dirname, 'dist'), filename: 'server.js' }
},
    modeConfig(mode),
    loadPresets({ mode, presets })
)};
