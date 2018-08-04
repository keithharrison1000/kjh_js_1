const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

module.exports = (mode) => {
  console.log(mode)
  return {
  entry: ['webpack/hot/poll?1000', './src/index'],
  watch: true,
  devtool: 'sourcemap',
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
  module: {
    rules: [
      //{
        //test: /\.js$/,
        //exclude: /node_modules/,
        //use: {
          //loader: "babel-loader",
          //options: {
            //babelrc: false,
            //presets: [['env', {"targets": {"node": "current"}, modules: false }],"stage-3"],
            //plugins: ['transform-regenerator', 'transform-runtime']
            //}
            
        //}
      //},
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  },
  plugins:[
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
        'process.env': { BUILD_TARGET: JSON.stringify('server') }
      }),
      new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
    ]
}
};
