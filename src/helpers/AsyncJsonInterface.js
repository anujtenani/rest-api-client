import shortId from "shortid";

var jsonWorker;
var pendingResult = {};
window.worker = jsonWorker;
export default class AsyncJsonInterface{

    constructor(){
        if(!jsonWorker) {
            jsonWorker = new Worker(window.URL.createObjectURL(new Blob([this.workerCore])));
            jsonWorker.onmessage = (event) => this.onMessageFromWorker(event);
        }
    }

    parse = (data)=>{
        return this.callFunction("parse", data);
    }

    stringify = (data,replacer ,space)=>{
        return this.callFunction("stringify", data, replacer, space)
    }

    callFunction = async (type, data, replacer, space)=>{
        if(!jsonWorker){
            throw new Error('Worker has not been initialized')
        }
        const key = shortId.generate();
        const resultPromise = new Promise((resolve, reject)=>{
            pendingResult[key] = {resolve, reject};
        });
        jsonWorker.postMessage({type, key, data, space});
        return this.promiseTimeout(15000, resultPromise)
    };

    onMessageFromWorker(event){
        const {key, result} = event.data;
        if(pendingResult[key]){
            pendingResult[key].resolve(result);
            delete pendingResult[key];
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

    workerCore = "onmessage = async (e)=>{\n" +
        "    const {type, key} = e.data;\n" +
        "    switch (type) {\n" +
        "        case \"stringify\": {\n" +
        "            const {data, replacer, space} = e.data;\n" +
        "            const result = JSON.stringify(data, replacer, space);\n" +
        "            return postMessage({key, result});\n" +
        "        }\n" +
        "        case \"parse\":\n" +
        "            const {data} = e.data;\n" +
        "            const result = JSON.parse(data);\n" +
        "            return postMessage({key, result});\n" +
        "    }\n" +
        "    return postMessage({key, error:'Invalid Type'});\n" +
        "}\n";


}

