const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

let BASE_URL = '/'
if (process.env.NODE_ENV !== 'development') {
  BASE_URL = `https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/${require('./package.json').name}/`
}
console.log('---BASE_URL: ', BASE_URL)

module.exports = {
  publicPath: BASE_URL,
  // webpack 配置
  configureWebpack: config => {
    // 设置入口文件
    config.entry.app = ['babel-polyfill', './src/main.js']
    // 设置将所有css 文件打包成一个
    if (process.env.NODE_ENV === 'production') {
      // config.externals = {
      //   'vue': 'Vue',
      //   'axios': 'axios',
      //   'iview': 'iview',
      //   'vue-router': 'VueRouter',
      //   'vue-i18n': 'vue-i18n'
      // }
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            // 配置缓存组
            vendor: {
              name: 'vendor',
              chunks: 'initial',
              minChunks: 1,
              priority: 10, // 优先级
              reuseExistingChunk: false, // 允许复用已经存在的代码块
              test: /[\\/]node_modules[\\/]vue|vuex|vue-router|iview|vue-i18n/
            },
            styles: {
              name: 'opms-styles', // 自定义名字
              test: /\.scss|css$/,
              chunks: 'all',
              enforce: true
            }
          }
        },
        minimizer: [new TerserPlugin({
          sourceMap: false,
          terserOptions: {
            compress: {
              warnings: true,
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']// 移除console
            }
          }
        })]
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
      .set('@_img', resolve('src/assets/img'))
      .set('@img', resolve('src/assets/img'))
      .set('@svg', resolve('src/components/svgImage'))
      .set('_ea', resolve('public-components-ea-hub/packages'))
  },
  productionSourceMap: true,
  devServer: {
    proxy: {
      '/opms/api/v1': {
        target: 'http://10.1.107.176:8302',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/opms/api/v1': 'opms/api/v1'
        }
      },
      '/bpo/v1': {
        target: 'https://opms-test.bytedance.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/bpo/v1': '/bpo/v1'
        }
      },
      '/bpo/v2': {
        target: 'https://opms-test.bytedance.com',
        // target: 'http://10.1.107.176:8301',
        // target: 'http://10.1.107.177:8301',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/bpo/v2': '/bpo/v2'
        }
      }
    }
  }
}