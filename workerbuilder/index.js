JSONPath = require('jsonpath/jsonpath.min');
UrlParser = require('url');
const formurlencoded = require('form-urlencoded').default;
CryptoJS = require('crypto-js');
// var MultipartBody = require('maltypart').RequestBody;

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
                const result = JSONPath.query(json, jsonquery);
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
        console.log(headers);
        const {value} = headers.find(({name, value})=>name.toLowerCase() === headerName.toLowerCase()) || {};
        console.log('got value', value);
        return value;
    }else{
        return "header not found";
    }
}

env = ()=>{
    const {activeEnv, variableAllIds, variableById, envVariableMap} = this.state.env;
    const varmap = {}
    //generate variable map
    variableAllIds.forEach((id)=>{
        varmap[variableById[id].name] = envVariableMap[id][activeEnv];
    });
    return varmap;
}

/**
 * Replaces functions or variables in strings
 */
transformString = (line)=>{
    const matches = line.match(/```(.*?)```/g);
    if (matches) {
        const fn = matches.map((item) => {
            return item.replace("```", '').replace('```','');
        });
        console.log(fn);
        const promises = fn.map((fn) => {
            if(fn.includes("(")){
                //TODO make way for on demand functions eg. ```base.timestamp()``` directly in the field
                //convert this function to
            }
            return callFunction(fn, this.state);
        });
        return Promise.all(promises).then((result) => {
            result.forEach(({data}, index) => {
                line = line.replace('```' + fn[index] + '```', data);
            });
            return line;
        });
    } else {
        return Promise.resolve(line);
    }
}


getRequestUrl = async (requestId)=>{
    const {url, path, qs} = findRequest(requestId);
    let ur = url;
    const qsObject = {};
    qs.allIds.forEach((qsId)=>{
        const {name, value} = qs.byId[qsId];
        qsObject[name] = value;
    });
    if(path && path.allIds){
        path.allIds.forEach((pathId)=>{
            const {name, value} = path.byId[pathId];
            ur = ur.split(name).join(value);
        });
    }
    const varmap = env();
    const baseurl = varmap['baseurl'] || '';
    ur = baseurl+ur;
    ur = ur.startsWith('http') ? ur : `http://${ur}`;
    ur = await transformString(ur);

    const parsedUrl = UrlParser.parse(ur, true);
    console.log(parsedUrl.query, qsObject);
    parsedUrl.query = {...parsedUrl.query, ...qsObject};
    parsedUrl.search = undefined;
    return UrlParser.format(parsedUrl);
}

getRequestBody = (requestId)=>{
    const {body} = findRequest(requestId);
    const {bodyType, data, params} = body;
    console.log(bodyType, data);
    switch (bodyType) {
        case "raw":
        case "json":
        case "xml":
            return data.value;
        case "binary":
            return DataUriToBlob(data.uri);
        case "form":
        case "application/x-www-urlformencoded":
            const params = getBodyParams(requestId);
            console.log(params);
            return createFormBody(params);
        case "multipart":
        case "multipart-formbody":
            return createMultipartBody(getBodyParams(requestId));
        case "graphql":
            return JSON.stringify({query:data.value});
        default:
            return ''
    }
}


getBodyParams = (requestId)=>{
    const {body} = findRequest(requestId);
    const {byId, allIds} = body;
    return allIds.map((item)=>{
        const {name, value, inputType, fileName, size, type} = byId[item];
        return {name, value, inputType, fileName, size, type};
    });
}

/**
 * Creates multipart body from the body object of the state
 * @returns {FormData}
 * @param params
 */
function createMultipartBody(params){
    const form = new FormData();
    params.forEach((item)=>{
        const {name, value, inputType, fileName, size, type} = item;
        if(inputType === "file"){
            form.append(name, DataUriToBlob(value), fileName)
        }else{
            form.append(name, value);
        }
    });
    console.log('got formdata', form);
    return form;
}


/**
 * Creates multipart body from the body object of the state
 * @returns {FormData}
 * @param params
 *
 function createMultipartBody(params){
    const form = new MultipartBody();
    params.forEach((item)=>{
        const {name, value, inputType, fileName, size, type} = item;
        if(inputType === "file"){
            form.append(name, {contentType:type, data: value, fileName})
        }else{
            form.append({name, value});
        }
    });
    console.log('got formdata', form.getData());
    return form.getData();
}
 */

/**
 * Creates form-url-encoded body from body object of the state
 * @returns {*}
 * @param params
 */
function createFormBody(params){
    const map = {};
    params.forEach((item)=>{
        const {name, value} = item;
        map[name] = value
    });
    return formurlencoded(map);
}


/**
 * Converts DataURI received from client (where it is stored in the state) to a blob
 * On the client side the binary data (i.e. files/images etc.) are stored as data uri's in the redux state
 * TO send these dataURI's as multipart-form-body we have to convert them to BLOB
 * @param dataURI
 * @returns {Blob}
 * @constructor
 */
function DataUriToBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});
}


/**
 * @param requestId
 * @param headerNames - optionally filter by header name
 */
getRequestHeaders = async (requestId, headerNames=null)=>{
    const {headers} = findRequest(requestId);
    const hdrs = headers.allIds.map((item)=>{
        const {name, value} = headers.byId[item];
        const n = transformString(name);
        const v = transformString(value);
        return Promise.all([n,v]);
    })

    const headerObj = await Promise.all(hdrs).then((result)=>{
        const obj = {}
        result.forEach((item)=>{
            const name = item[0];
            obj[name] = item[1];
        });
        return obj;
    })
    const authHeaders = {};
//    const authHeaders = await buildAuthHeaders(state, requestId, worker);
    const h = {...headerObj, ...authHeaders};
    //apply filter;
    if(headerNames) {
        const filter = headerNames instanceof Array ? headerNames : [headerNames];
        const lowerCaseFilter = filter.map((item)=>item.toLowerCase());
        const keys = Object.keys(h).filter((headerName)=>{
            return lowerCaseFilter.indexOf(headerName.toLowerCase()) > -1
        });
        let filteredHeaders = {};
        keys.forEach((k)=>{
           filteredHeaders[k] = h[k];
        });
        return filteredHeaders;
    }else{
        return h;
    }
}

md5 = (text)=> CryptoJS.MD5(text).toString();

base = {
    timestamp:()=>new Date().getTime(),
    findRequestById:(state, requestId)=>{
        console.log(state, requestId);
        return state.requests.byId[requestId]
    },
}

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
            console.log('executing', `return ${fn}`);
//            https://stackoverflow.com/a/12208375
            const data = await new Function(`return ${fn}`)();
            return {data : typeof data === "object" ? JSON.stringify(data) : data};
        }
        const func = fn.split('.').reduce((acc, cur)=>acc ? acc[cur] : undefined, this);
        if(func){
            let data = typeof func === "function" ?  await func(state,args) : func;
            return {data : typeof data === "object" ? JSON.stringify(data) : data};
        }else{
            return {error:"Undefined function "+fn+":"+func}
        }
    }catch(err){
        console.log('got error', err);
        return {error:err.toString()}
    }
}
