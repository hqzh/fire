const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    configureWebpack: config => {
        config.externals = {
            'AMap': 'AMap', // 高德地图配置
        }
        if (process.env.NODE_ENV === 'production') {
            const plugins = [
                new CompressionPlugin({
                    algorithm: 'gzip',
                    test: /\.(js|css|json|txt|html|ico|svg|obj|mtl)$/,// 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: true, // 不删除源文件
                    minRatio: 0.8 // 压缩比
                })
            ]
            config.plugins = [...config.plugins, ...plugins];
        }

    },
    runtimeCompiler: true
}