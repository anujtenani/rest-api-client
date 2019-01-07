/**
 * Playground for writing worker core javascript to be copy pasted later in BuildWorkerBlob file
 *
 * DO NOT USE toString()
 * See : https://stackoverflow.com/a/5265038
 */

findRequest = (idOrName)=>{
    const state = this.state;
    if(state.requests.byId[idOrName]) return state.requests.byId[idOrName];
    const id = state.requests.allIds.find((requestId)=>{
        console.log('matching', state.requests.byId[requestId].name, idOrName);
        return state.requests.byId[requestId].name === idOrName
    });
    if(id) return state.requests.byId[id];
    else throw new Error('Request not found');
}
getResponseBody = (requestId)=>{
    const request =  findRequest(requestId);
    const { history } = request;
    if(history.allIds.length > 0) {
        const {body} = history.byId[history.allIds[0]];
        //decode if content-type is json
        const contentType = getResponseHeader(requestId, 'content-type');
        console.log('got content type', contentType);
        return contentType.includes("application/json") ? JSON.parse(body) : body;
    }
}
getResponseHeader = (requestId, headerName)=>{
    const { history } = findRequest(requestId);
    if(history.allIds.length > 0) {
        const {headers} = history.byId[history.allIds[0]];
        const {value} = headers.find(({name, value})=> name.toLowerCase() === headerName) || {};
        return value;
    }
}


base = {
    timestamp:()=>new Date().getTime(),
    findRequestById:(state, requestId)=>{
        console.log(state, requestId);
        return state.requests.byId[requestId]
    },
}

importScripts("https://cdn.jsdelivr.net/gh/dchester/jsonpath/jsonpath.min.js");

onmessage = async (e)=>{
    const {type, key} = e.data;
    switch (type) {
        case "call":
            const { fn, state, args} = e.data;
            this.state = state;
            console.log("calling", fn, state, args);
            callFunction(fn, state, args).then((result)=>{
                postMessage({key, result});
            });
            break;
        case "update.vars":
            const {vars} = e.data;
            Object.keys(vars).forEach((item)=>{
                this[item] = vars[item];
            });
            postMessage({key, result:{data:"variables updated"}});
        break;
        default:
            postMessage({key, result: {error: "Method type not supported"}})


    }
}


async function callFunction(fn, state,args) {
    try{
        const func = fn.split('.').reduce((acc, cur)=>acc ? acc[cur] : undefined, this);
        if(func){
            const data = await func(state,args);
            return {data}
        }else{
            return {error:"Undefined function "+fn}
        }
    }catch(err){
        console.log('got error', err);
        return {error:err.toString()}
    }
}
