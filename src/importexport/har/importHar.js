const shortId = require('shortid');
export function doImport(harObject){
    const {entries} = harObject.log;
    return entries.map((entry)=>{
        return entryToRequest(entry)
    });
}

function entryToRequest(entry){
    const requestTemplate = {
        name:'',
        type:'request',
        url:'',
        method:'',
        headers:{
            byId:{

            },
            allIds:[]
        },
        auth:{
            authType:'noauth',
        },
        qs:{
            byId:{

            },
            allIds:[]
        },
        body:{
            bodyType:'',
            allIds:[],
            byId:{},
        },
        history:{
            byId:{},
            allIds:[]
        }
    }

    requestTemplate.name = entry.comment;
    const {request, response, serverIPAddress, connection, startedDateTime, timings} = entry;
    if(request) {
        const {method, url, httpVersion, cookies, headers, queryString, postData} = request;
        requestTemplate.method = method;
        requestTemplate.url = url;
        if (headers) {
            requestTemplate.headers = requestHeaders(headers);
        }
        if (queryString) {
            requestTemplate.qs = requestQueryString(queryString);
        }
        if (response) {
            requestTemplate.history = createResponseHistory(response, url, timings, serverIPAddress, headers);
        }
        if (postData) {
            requestTemplate.body = createRequestBody(postData);
        }
    }
    return requestTemplate;
}


function createRequestBody(postData){
    const {mimetype, params, text} = postData;
    const bodyType = bodyTypeToMimeType(mimetype);
    const byId = {};
    const allIds = [];
    if(bodyType !== "text"){
        //get the text field and use this in params
        params.forEach((item)=>{
            const {name, value, comment} = item;
            const bodyId = shortId.generate();
            allIds.push(bodyId);
            byId[bodyId] = {
                bodyId,
                name, value, comment
            }
        })
    }
    return {
        byId, allIds, bodyType, text
    }
}

function bodyTypeToMimeType(mimetype){
    switch (mimetype) {
        case "application/x-www-form-urlencoded":
            return "form";
        case "multipart/form-data":
            return "multipart";
        case "text/plain":
            return "text";
        default:
            return "form"
    }
}

function createResponseHistory(response, url, timings, serverIPAddress, requestHeaders){
    const {status, statusText, httpVersion, cookies, headers, content, comment} = response;
    const {mimeType, text} = content;
    const historyId = shortId.generate();
    const allIds = [historyId];
    const byId = {};
    byId[historyId] = {
        historyId,
        statusCode: status,
        httpVersion,
        headers: responseHeaders(headers),
        body: text,
        timingPhases: responseTimingPhases(timings),
        remoteAddress: serverIPAddress,
        href: url,
        requestHeaders: requestHeadersForResponse(requestHeaders),
    }
    return {allIds, byId}
}

function requestHeadersForResponse(headers){
    return headers ? responseHeaders(headers) : []
}


function responseHeaders(headers){
    return headers.map((header)=>{
        const {name, value} = header;
        return {name, value}
    });
}

function requestQueryString(queryString){
    const allIds = [];
    const byId = {};
    queryString.forEach((header)=>{
        const {name, value, comment} = header;
        const id = shortId.generate();
        allIds.push(id);
        byId[id] = {name, value, id, comment}
    });
    return {
        allIds, byId
    }
}

function responseTimingPhases(timings){
    const {send, wait, dns, connect, receive, ssl} = timings;
    return {
        wait, dns, tcp:connect, firstByte: ssl, download: receive, total: send+wait+dns+connect+receive+ssl
    }
}

function requestHeaders(headers){
    const allIds = [];
    const byId = {};
    headers.forEach((header)=>{
        const {name, value, comment} = header;
        const id = shortId.generate();
        allIds.push(id);
        byId[id] = {name, value, id, comment}
    });
    return {
        allIds, byId
    }
}
