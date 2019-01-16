import shortId from 'shortid';
import {sendRequest} from "../../servicehandlers";
export default class WebWorker{

    worker;
    pendingResult = {};


    constructor(state){
        const fnObject = {};
        state.func.allIds.forEach((func)=>{
            const {name, value} = state.func.byId[func];
            fnObject[name] = `async ()=> { 
            ${value}
            ;}`;
        });

        const activeEnv = state.env.activeEnv;
        state.env.variableAllIds.forEach((varId)=>{
//            fnObject[state.env.variableById[varId].name] = `()=>"${state.env.envVariableMap[varId][activeEnv]}"`;
            fnObject[state.env.variableById[varId].name] = `"${state.env.envVariableMap[varId][activeEnv]}"`;
        });

        console.log('functionObject', fnObject);
        this.startWorker(fnObject);
    }

    /**
     * to be called after the store is hydrated or a new function/plugin is added
     * Create a blob of javascript from
     *      functions and variables in the store
     *      importScripts() of any plugins (including the base functions)
     *      custom onmessaging function which responds to commands
     */
    startWorker = (func = {}) => {
        const workerUrl = this.getWorkerObjectUrl(func);
        console.log('creating worker', workerUrl);
        this.worker = new Worker(workerUrl);
        this.worker.onmessage = (event)=> this.onMessageFromWorker(event);
    };




    terminate = ()=>{
        if(this.worker){
            this.worker.terminate();
        }
    };

    updateVariables = ()=>{

    }

    /**
     * This is an optimization to prevent creating a new worker everytime a variable is added or removed
     * Send update variable with default value (undefined in case if variable is removed)
     */
    updateWorker = ()=>{

    };

    /**
     * @param fn Function name
     * @param state
     * @param args - Function args
     * @param truncateLength - number - if this number is set, the result is truncated, so that it can be easily
     * displayed in function preview
     * @returns {Promise<void>}
     */
    callFunction = async (fn, state, args, truncateLength = -1)=>{
        if(!this.worker){
            throw new Error('Worker has not been initialized')
        }
        const key = shortId.generate();
        const resultPromise = new Promise((resolve, reject)=>{
            this.pendingResult[key] = {resolve, reject};
        });
        this.worker.postMessage({type:'call', fn, args, state, key, truncateLength});
        return this.promiseTimeout(5000, resultPromise)
    };

    onMessageFromWorker(event){
        const {key, result, type} = event.data;
        if(type === "sendrequest.call"){
            //since we can't send request from worker (no window or document available, use the message passing to send fetch request)
            const {url, method, headers, body} = event.data;
            console.log("calling sendrequest.call",method);
            sendRequest(url, method, headers, body).then((response)=>{
                console.log('got response', response);
                this.worker.postMessage({key, response, type:"sendrequest.response"})
            });
        }else {
            if(this.pendingResult[key]){
                this.pendingResult[key].resolve(result);
                delete this.pendingResult[key];
            }
        }
    }

    promiseTimeout = function(ms, promise){
        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('Timed out in '+ ms + 'ms.')
            }, ms)
        });
        return Promise.race([
            promise,
            timeout
        ]);
    }

    getWorkerObjectUrl(fnObject){
        const workerCore = "" +
            `importScripts(${document.location.origin}/worker.js');` +
            "";
        const blob = new Blob([this.customFunctions(fnObject), workerCore]);
        return window.URL.createObjectURL(blob);
    }


    customFunctions = (fnObject)=>{
        var blobParts = [];
        blobParts.push(Object.keys(fnObject).map((item)=>{
            return `${item} = ${fnObject[item]}`;
        }));
        blobParts.join(';');
        return blobParts+";";
    }
}
