const path = require('path');
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
        minimize:true
    }
};
