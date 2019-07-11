const path = require("path")
/**
 * 本地代理服务器配置
 * @devApiUrl 服务器地址
 * @devApiPort 服务器端口
 */
const devApiUrl = "ts-www.luckyins.com"
/**
 * VUE-CONFIG
 * 包括vue项目本身配置，以及webpack基本及扩展配置
 */
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html"
    }
  },
  css: {
    loaderOptions: {
    }
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          enforce: "pre",
          exclude: /node_modules/,
          use: {
            loader: "eslint-loader",
            options: {
              formatter: require("eslint-friendly-formatter")
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.common.js",
        public: path.join(__dirname, "public"),
        "@": path.join(__dirname, "src/views/"),
        assets: path.join(__dirname, "src/assets"),
        coms: path.join(__dirname, "src/components")
      },
      extensions: [".js", ".vue", ".json", ".css", ".node"]
    }
  },
  // 代理服务
  devServer: {
    port: 8080,
    // host: '127.0.0.1',
    proxy: {
      "/api": {
        target: "https://" + devApiUrl + "",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
}
