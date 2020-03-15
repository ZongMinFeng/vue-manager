module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            // '/mall/*': {
            //     // target: 'https://www.v-ss.com',//测试
            //     target: 'https://www.v-uu.com',//生产
            //     secure: false,
            //     changeOrigin: true
            // },
            //
            // '/api/*': {
            //     // target: 'https://www.v-ss.com',//测试
            //     target: 'https://www.v-uu.com',//生产
            //     secure: false,
            //     changeOrigin: true
            // },

            '/': {
                // target: 'http://10.168.1.114:8080',//胡总测试
                target: 'https://www.v-uu.com',//测试
                secure: false,
                changeOrigin: true
            },
        }
    }
};
