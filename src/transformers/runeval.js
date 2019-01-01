// https://www.html5rocks.com/en/tutorials/workers/basics/#toc-inlineworkers
// also importScripts to import commonly used functions from server as a file
// for hashing functions use await and create at server side
//

import * as threadify from 'threadify';


var myFunction = threadify(async function (param1, param2) {
    // The code of this function will be executed inside a web worker
    var thread = this;
    return param1 + param2;
});

var job = myFunction("param1", "param2");

// this function will be called once the function return something.
job.done = function (result) {
    console.log(result);
};
