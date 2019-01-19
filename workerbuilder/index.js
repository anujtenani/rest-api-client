const digest = require('./auth/digest');
const basic = require('./auth/basic');
JSONPath = require('jsonpath/jsonpath.min');
UrlParser = require('url');
const shortid = require('shortid');
uuid = require('uuid');
const multipart = require('./MultipartBuilder');
const formurlencoded = require('form-urlencoded').default;
CryptoJS = require('crypto-js');

//exported
findRequest = (idOrName)=>{
    const state = this.state;
    if(state.requests.byId[idOrName]) return state.requests.byId[idOrName];
    const id = state.requests.allIds.find((requestId)=>{
        return state.requests.byId[requestId].name === idOrName
    });
    if(id) return state.requests.byId[id];
    else throw new Error('Request not found '+idOrName);
}

nonce = ()=>shortid.generate();


//exported
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
//exported
getResponseHeader = (requestId, headerName)=>{
    const { history } = findRequest(requestId);
    if(history.allIds.length > 0) {
        const {headers} = history.byId[history.allIds[0]];
        const {value} = headers.find(({name, value})=>name.toLowerCase() === headerName.toLowerCase()) || {};
        return value;
    }else{
        return "header not found";
    }
}

//exported
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

    if(!line) return '';
//    const matches = line.match(/```(.*?)```/g);
    const matches = line.match(/{{(.*?)}}/g);
    if (matches) {
        const fn = matches.map((item) => {
            return item.replace("{{", '').replace('}}','');
        });
        console.log(fn);
        const promises = fn.map((fn) => {
            return callFunction(fn, this.state);
        });
        return Promise.all(promises).then((result) => {
            result.forEach(({data}, index) => {
                line = line.replace('{{' + fn[index] + '}}', data);
            });
            return line;
        });
    } else {
        return Promise.resolve(line);
    }
}

//export
getRequestUrl = async (requestId)=>{
    const {url, path, qs} = findRequest(requestId);
    let ur = url;
    const qsObject = {};
    const qsPromises = qs.allIds.map((qsId)=>{
        const {name, value} = qs.byId[qsId];
        return Promise.all([transformString(name), transformString(value)]);
    });
    const qsdata = await Promise.all(qsPromises);
    qsdata.forEach((item)=>{
        qsObject[item[0]] = item[1];
    })

    if(path && path.allIds){
        path.allIds.forEach((pathId)=>{
            const {name, value} = path.byId[pathId];
            ur = ur.split(name).join(value);
        });
    }

    ur = await transformString(ur);

    const varmap = env();
    if(!ur.startsWith('http')) {
        const baseurl = varmap['baseurl'] || '';
        ur = baseurl + ur;
    }
    ur = ur.startsWith('http') ? ur : `http://${ur}`;

    const parsedUrl = UrlParser.parse(ur, true);
    console.log(parsedUrl.query, qsObject);
    parsedUrl.query = {...parsedUrl.query, ...qsObject};
    parsedUrl.search = undefined;
    return UrlParser.format(parsedUrl);
}

//export
getRequestBody = async (requestId, forPreview = true)=>{
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
            const params = await getBodyParams(requestId);
            console.log(params);
            return createFormBody(params);
        case "multipart":
        case "multipart-formbody":
            const bodyParams = await getBodyParams(requestId);
            if(forPreview) {
                return new multipart().toString(bodyParams);
            }else{
                return new multipart().toDataUrl(bodyParams);
            }
        case "graphql":
            return JSON.stringify({query:data.value});
        default:
            return ''
    }
}


const buildAuthorizationHeader = async (url, method, requestId) => {
    const {auth} = findRequest(requestId);
    const {authType} = auth;
    switch (authType) {
        case "basic": {
            const username = await transformString(auth.username);
            const password = await transformString(auth.password);
            return {Authorization: basic.convertAuthToHeader(username, password)};
        }
        case "digest": {
            const response = await corsFetch(url, method);
            const {realm, qop, nonce, opaque} = digest.extractDataFromResponse(response);
            const username = await transformString(auth.username);
            const password = await transformString(auth.password);
            return {Authorization: await digest.convertAuthToHeader(url, method, username, password, {realm, qop, nonce, opaque})}
        }
        case "bearer":
            const bearer = await transformString(auth.bearer);
            return {Authorization : `Bearer ${bearer}`};
        case "hawk":
            //TODO substitute variables
//                return {Authorization : hawk.convertAuthToHeader(url, method, auth.id, auth.key, auth.algorithm, auth.ext) }
        default:
            return {}
    }
}


const getBodyParams = (requestId)=>{
    const {body} = findRequest(requestId);
    const {byId, allIds} = body;
    const promises =  allIds
        .filter((item)=>{
            return !!byId[item].name;
        })
        .map((item)=>{
            const {name, value, inputType, fileName, size, contentType} = byId[item];
            return Promise.all([transformString(name), transformString(value), Promise.resolve({inputType, fileName, size, contentType})]);
        });

    return Promise.all(promises)
        .then((items)=>{
            return items.map((result)=>{
                const name = result[0];
                const value = result[1];
                const obj = result[2];
                return {name, value, ...obj};
            })
    })
}





/**
 * Creates multipart body from the body object of the state
 * @returns {FormData}
 * @param params
 */
function createMultipartBody(params){
    console.log('got params creating body', params);
    return new multipart().toBlob(params);
}


/**
 * Creates form-url-encoded body from body object of the state
 * @returns {*}
 * @param params
 */
async function createFormBody(params){
    const map = {};
    params.map(({name, value})=>{
        return map[name] = value;
    });
    console.log('complete map', map);
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
    const {headers, method, body} = findRequest(requestId);
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
    const url = getRequestUrl(requestId);
    const authHeaders = await buildAuthorizationHeader(url, method, requestId);
//    const authHeaders = await buildAuthHeaders(state, requestId, worker);
    const bodyHeaders = await getBodyHeaders(requestId);
    const h = {...headerObj, ...authHeaders, ...bodyHeaders};

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
        return filter.length === 1 ? filteredHeaders[keys[0]] : filteredHeaders;
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
    const {type, key, truncateLength} = e.data;
    switch (type) {
        case "call":
            const { fn, state, args} = e.data;
            this.state = state;
            console.log("calling", fn, state, args);
            callFunction(fn, state, args).then((result)=>{
                if(truncateLength > -1 && result.data) {
                    const data = result.data.length > truncateLength ? result.data.substr(0, truncateLength) : result.data;
                    postMessage({key, result: {data}});
                }else{
                    postMessage({key, result});
                }
            });
            break;
        case "sendrequest.response":{
            const {key, response} = e.data;
            if(pendingPromises[key]){
                pendingPromises[key](response);
                delete pendingPromises[key];
            }
            break;
        }
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


const pendingPromises = {};
corsFetch = (url, method, headers, body)=>{
    console.log("worker", method);
    const key = nonce();
    const type = "sendrequest.call";
    const promise = new Promise((resolve, reject)=>{
        pendingPromises[key] = resolve;
    });
    postMessage({type, key, url, method, headers, body});
    return promise;
}

/*
const promiseTimeout = function(ms, promise){
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
*/

getBodyHeaders = (requestId)=>{
    const {body} = findRequest(requestId);
    const {bodyType} = body || {};
    switch (bodyType) {
        case "form":
        case "application/x-www-form-urlencoded":
            return {'Content-Type':'application/x-www-form-urlencoded'};
        case "multipart":
        case "multipart-formbody":
            return {'Content-Type': 'multipart/form-data; charset=utf-8; boundary=__X__BOUNDARY__'}
        case "text":
            return {'Content-Type':'text/plain'};
        case "json":
        case "graphql":
            return {'Content-Type':'application/json'};
        case "xml":
            return {'Content-Type':'application/xml'};
        case "binary":
            return {'Content-Type':body.contentType};
        default:
            return {}
    }
}

getRequest = async (requestId, forPreview = true) =>{
    const {method, body} = findRequest(requestId);
    const url = await getRequestUrl(requestId);
    const b = method !== "GET" ? await getRequestBody(requestId, forPreview) : undefined;
    const headers = await getRequestHeaders(requestId);
    const bodyType = forPreview ? undefined : body.bodyType;
    return {url, method, headers, body:b, bodyType};
}

run = async (requestId)=>{
    try {
        const {url, method, headers, body, bodyType} = await getRequest(requestId, false);
        return await corsFetch(url, method, headers, body, bodyType);
    }catch (e) {
        return e.toString();
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
