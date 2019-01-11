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
        return state.requests.byId[requestId].name === idOrName
    });
    if(id) return state.requests.byId[id];
    else throw new Error('Request not found');
}
getResponseBody = (requestId, jsonquery)=>{
    const request =  findRequest(requestId);
    const { history } = request;
    if(history.allIds.length > 0) {
        const {body} = history.byId[history.allIds[0]];
        try{
            const json =  JSON.parse(body);
            console.log('jsonquery', jsonquery);
            if(jsonquery){
                const result = jsonpath.query(json, jsonquery);
                console.log('returning', result);
                return result.length === 1 ? result[0] : result;
            }else{
                console.log('returning', 'x');
                return json;
            }
        }catch(e){
            console.log('error',e);
            return body;
        }
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
        if(fn.includes("(")){
            var foo = new Function(fn)();
            //it is now called like this.
            //https://stackoverflow.com/a/12208375
//            var baz = eval('function(){ return 1 + 2 }');
        }

        const func = fn.split('.').reduce((acc, cur)=>acc ? acc[cur] : undefined, this);
        if(func){
            const data = await func(state,args);
            return {data}
        }else{
            return {error:"Undefined function "+fn+":"+func}
        }
    }catch(err){
        console.log('got error', err);
        return {error:err.toString()}
    }
}
