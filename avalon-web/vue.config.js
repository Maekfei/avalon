module.exports = {
    publicPath:'./',
    assetsDir:'assets',
    devServer:{
        port:3000,
        proxy:{
            '/api':{
                target:'http://192.168.40.12:8974',
                changOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
}