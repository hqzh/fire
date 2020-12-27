module.exports = {
    configureWebpack: {
        externals: {
            'AMap': 'AMap' // 高德地图配置
        }
    },
    outputDir:"docs", //打包后的项目目录名称
    publicPath:"./docs"  // 静态路径
}