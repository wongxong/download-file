

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'download.js',
    libraryTarget: 'umd',
    library: 'download'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}