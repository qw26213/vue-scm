'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

function getProdExternals() {
  return {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'axios': 'axios',
    'element-ui': 'ELEMENT'
  };
}

const name = defaultSettings.title || 'vue'
module.exports = {
  publicPath: '',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV !== 'production',
  lintOnSave: false,
  productionSourceMap: false,
  // productionGzip: true,
  // productionGzipExtensions: ['js', 'css'],
  devServer: {
    port: '8000',
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/drp': {
        target: 'http://81.70.101.14/',
        // target: 'http://192.168.10.49/',
        ws: true,
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        // secure: false,// 如果是https接口，需要配置这个参数
        pathRewrite: {// 如果接口本身没有/drp需要通过pathRewrite来重写了地址
          '^/drp': '/drp'
        }
      }
    }
  },
  configureWebpack: {
    name: name,
    externals:process.env.NODE_ENV === 'development' ? {} : getProdExternals(),
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: process.env.NODE_ENV === 'development'?'public/index.dev.html':'public/index.html',
        inject: true
      })
      // new CompressionWebpackPlugin({
      //   asset: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: new RegExp(
      //     '\\.(' +
      //     config.build.productionGzipExtensions.join('|') +
      //     ')$'
      //   ),
      //   threshold: 10240,
      //   minRatio: 0.8
      // })
    ],
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
        symbolId: 'icon-[name]'
      }).end()
    config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      }).end()
    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))
  }
}
