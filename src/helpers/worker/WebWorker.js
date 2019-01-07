import {fn} from "./test";
import shortId from 'shortid';
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
            fnObject[state.env.variableById[varId].name] = `()=>"${state.env.envVariableMap[varId][activeEnv]}"`;
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
    startWorker = (func = fn) => {
        const workerUrl = this.getWorkerObjectUrl(func);
        console.log('creating worker', workerUrl);
        this.worker = new Worker(workerUrl);
        this.worker.onmessage = (event)=> this.onMessageFromWorker(event);
    };

    terminate = ()=>{
        if(this.worker){
            this.worker.terminate();
        }
    }

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
     * @returns {Promise<void>}
     */
    callFunction = async (fn, state, args)=>{
        if(!this.worker){
            throw new Error('Worker has not been initialized')
        }
        const key = shortId.generate();
        const resultPromise = new Promise((resolve, reject)=>{
            this.pendingResult[key] = {resolve, reject};
        });
        this.worker.postMessage({type:'call', fn, args, state, key});
        return this.promiseTimeout(5000, resultPromise)
    };

    onMessageFromWorker(event){
        const {key, result} = event.data;
        if(this.pendingResult[key]){
            this.pendingResult[key].resolve(result);
            delete this.pendingResult[key];
        }
    }

    promiseTimeout = function(ms, promise){

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

    getWorkerObjectUrl(fnObject){
        const blob = new Blob([this.customFunctions(fnObject), this.workerCore]);
        return window.URL.createObjectURL(blob);
    }


    customFunctions = (fnObject = fn)=>{
        var blobParts = [];
        blobParts.push(Object.keys(fnObject).map((item)=>{
            return `${item} = ${fnObject[item]}`;
        }));
        blobParts.join(';');
        return blobParts+";";
    }


    workerCore = "/**\n" +
        " * Playground for writing worker core javascript to be copy pasted later in BuildWorkerBlob file\n" +
        " *\n" +
        " * DO NOT USE toString()\n" +
        " * See : https://stackoverflow.com/a/5265038\n" +
        " */\n" +
        "\n" +
        "findRequest = (idOrName)=>{\n" +
        "    const state = this.state;\n" +
        "    if(state.requests.byId[idOrName]) return state.requests.byId[idOrName];\n" +
        "    const id = state.requests.allIds.find((requestId)=>{\n" +
        "        console.log('matching', state.requests.byId[requestId].name, idOrName);\n" +
        "        return state.requests.byId[requestId].name === idOrName\n" +
        "    });\n" +
        "    if(id) return state.requests.byId[id];\n" +
        "    else throw new Error('Request not found');\n" +
        "}\n" +
        "getResponseBody = (requestId)=>{\n" +
        "    const request =  findRequest(requestId);\n" +
        "    const { history } = request;\n" +
        "    if(history.allIds.length > 0) {\n" +
        "        const {body} = history.byId[history.allIds[0]];\n" +
        "        //decode if content-type is json\n" +
        "        const contentType = getResponseHeader(requestId, 'content-type');\n" +
        "        console.log('got content type', contentType);\n" +
        "        return contentType.includes(\"application/json\") ? JSON.parse(body) : body;\n" +
        "    }\n" +
        "}\n" +
        "getResponseHeader = (requestId, headerName)=>{\n" +
        "    const { history } = findRequest(requestId);\n" +
        "    if(history.allIds.length > 0) {\n" +
        "        const {headers} = history.byId[history.allIds[0]];\n" +
        "        const {value} = headers.find(({name, value})=> name.toLowerCase() === headerName) || {};\n" +
        "        return value;\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "\n" +
        "base = {\n" +
        "    timestamp:()=>new Date().getTime(),\n" +
        "    findRequestById:(state, requestId)=>{\n" +
        "        console.log(state, requestId);\n" +
        "        return state.requests.byId[requestId]\n" +
        "    },\n" +
        "}\n" +
        "\n" +
        "importScripts(\"https://cdn.jsdelivr.net/gh/dchester/jsonpath/jsonpath.min.js\");\n" +
        "\n" +
        "onmessage = async (e)=>{\n" +
        "    const {type, key} = e.data;\n" +
        "    switch (type) {\n" +
        "        case \"call\":\n" +
        "            const { fn, state, args} = e.data;\n" +
        "            this.state = state;\n" +
        "            console.log(\"calling\", fn, state, args);\n" +
        "            callFunction(fn, state, args).then((result)=>{\n" +
        "                postMessage({key, result});\n" +
        "            });\n" +
        "            break;\n" +
        "        case \"update.vars\":\n" +
        "            const {vars} = e.data;\n" +
        "            Object.keys(vars).forEach((item)=>{\n" +
        "                this[item] = vars[item];\n" +
        "            });\n" +
        "            postMessage({key, result:{data:\"variables updated\"}});\n" +
        "        break;\n" +
        "        default:\n" +
        "            postMessage({key, result: {error: \"Method type not supported\"}})\n" +
        "\n" +
        "\n" +
        "    }\n" +
        "}\n" +
        "\n" +
        "\n" +
        "async function callFunction(fn, state,args) {\n" +
        "    try{\n" +
        "        const func = fn.split('.').reduce((acc, cur)=>acc ? acc[cur] : undefined, this);\n" +
        "        if(func){\n" +
        "            const data = await func(state,args);\n" +
        "            return {data}\n" +
        "        }else{\n" +
        "            return {error:\"Undefined function \"+fn}\n" +
        "        }\n" +
        "    }catch(err){\n" +
        "        console.log('got error', err);\n" +
        "        return {error:err.toString()}\n" +
        "    }\n" +
        "}\n";

}
