var webpack = require("webpack");
module.exports = {
  publicPath: "",
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        zrender: "zrender",
        "windows.zrender": "zrender",
      }),
    ],
  },
  devServer: {
    proxy: {
      '/api' : {
        target: 'http://happycom.icnslab.net:8281/',
        changeOrigin: true,
      },
      '/ws' : {
        target: 'http://happycom.icnslab.net:8281/',
	      changeOrigin: true,
        ws: true,
      }
    },
    disableHostCheck: true,
    overlay: true,
  },

  lintOnSave: undefined,
};
