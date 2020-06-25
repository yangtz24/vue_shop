module.exports = {
  runtimeCompiler: true,
  publicPath: '/', // 设置打包文件相对路径
  devServer: {
    // open: process.platform === 'darwin',
    host: 'localhost',
    port: 8081,
    // open: true, //配置自动启动浏览器
    
    proxy: {
      '/api': {
        target: 'http://123.56.143.183:8080', //对应自己的接口
        // target: 'http://127.0.0.1:8888', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
   },
}