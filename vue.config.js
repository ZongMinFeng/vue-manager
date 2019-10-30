module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/mall/*': {
                // target: 'https://www.v-ss.com',//测试
                target: 'https://www.v-uu.com',//生产
                secure: false,
                changeOrigin: true
            },

            '/api/*': {
                // target: 'https://www.v-ss.com',//测试
                target: 'https://www.v-uu.com',//生产
                secure: false,
                changeOrigin: true
            },
        }
    }
};
