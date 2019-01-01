import {fn} from "./test";
import {getWorkerObjectUrl} from "./BuildWorkerBlob";

const shortId = require('shortid');
let worker = undefined;


/**
 * to be called after the store is hydrated or a new function/plugin is added
 * Create a blob of javascript from
 *      functions and variables in the store
 *      importScripts() of any plugins (including the base functions)
 *      custom onmessaging function which responds to commands
 */
export const startWorker = (store = fn) => {
    const workerUrl = getWorkerObjectUrl(store);
    console.log('creating worker', workerUrl);
    worker = new Worker(workerUrl);
    worker.onmessage = (event)=> onMessageFromWorker(event);
};

/**
 * This is an optimization to prevent creating a new worker everytime a variable is added or removed
 * Send update variable with default value (undefined in case if variable is removed)
 */
export const updateWorker = ()=>{

};

var pendingResult = {};
/**
 * @param fn Function name
 * @param args - Function args
 * @returns {Promise<void>}
 */
export const callFunction = async (fn, args)=>{
    if(!worker){
        throw new Error('Worker has not been initialized')
    }
    const key = shortId.generate();
    const resultPromise = new Promise((resolve, reject)=>{
        pendingResult[key] = {resolve, reject};
    });
    worker.postMessage({type:'call', fn, args, key});
    return promiseTimeout(5000, resultPromise)
};

function onMessageFromWorker(event){
    const {key, result} = event.data;
    if(pendingResult[key]){
        pendingResult[key].resolve(result);
        delete pendingResult[key];
    }
}

const promiseTimeout = function(ms, promise){

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in '+ ms + 'ms.')
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}
