// 参考复制的配置

'use strict'

const path = require('path')

module.exports = {
  // 开发环境的配置
  dev: {
    // Paths, 路径
    assetsSubDirectory: 'static', // 目录
    assetsPublicPath: '/', // 根路径
    proxyTable: { // 请求代理转发
      '/': {
        target: 'http://localhost:52152',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    },

    // Various Dev Server settings, 服务器配置
    host: 'localhost', // 域名
    // 端口号
    port: 8080,  // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false, // 是否自动打开浏览器
    errorOverlay: true, // 启动错误显示
    notifOnError: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // 代码压缩的方式
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    cssSourceMap: true
  },

  // 打包生成环境的配置
  build: {
    // Template for index.html, 生成html文件
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths 路径
    assetsRoot: path.resolve(__dirname, '../dist'), // 根路径
    assetsSubDirectory: 'static', // 静态资源的文件目录
    assetsPublicPath: './', // 针对服务器静态资源的资源路径

    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // 是否开启webpack服务器
    productionSourceMap: false,


    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 是否开启gzip传输
    productionGzipExtensions: ['js', 'css'], // 开启传输的文件

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
