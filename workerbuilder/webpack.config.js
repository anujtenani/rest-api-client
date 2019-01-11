const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    entry: {
        'bundle.js': [
            path.join(__dirname, '/index.js')
        ]
    },
    output: {
        filename: 'worker.js',
        path: path.join(__dirname,'..','public'),
    },
    optimization:{
        minimize:false
    }
    /*
       optimization: {

           minimizer: [

               new TerserPlugin({ terserOptions: {
                       warnings: false,
                       parse: {},
                       compress: {},
                       mangle: true, // Note `mangle.properties` is `false` by default.
                       output: null,
                       toplevel: false,
                       nameCache: null,
                       ie8: false,
                       keep_fnames: true,
                   }})
           ],


    },
    plugins: [

        // new UglifyJsPlugin({keep_fnames:true})
//        new CopyWebpackPlugin([{from: path.resolve(__dirname, 'manifest.json'), to: path.resolve(__dirname, 'build')}])
    ]
         */
};
