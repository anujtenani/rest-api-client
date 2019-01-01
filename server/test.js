const nunjucks = require('nunjucks');
nunjucks.configure()
const string = nunjucks.renderString('Hello {{ await username() }}', { username: function () {return new Promise((resolve, reject)=>resolve('Anuj'));} });
console.log(string);
