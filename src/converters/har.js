const Cookie = require('tough-cookie');
//source https://github.com/ahmadnassri/har-spec/blob/master/versions/1.2.md
function projectToHar(){
    const log = {
        "version" : "1.2",
        "creator" : {
            "name": "Firebug",
            "version": "1.6",
            "comment": ""
        },
        "browser" : {},
        "pages": [],
        "entries": [],
        "comment": ""
    }
}

function createEntryFromRequest(request){
    const {history} = request;
    const response = history.allIds.length > 0 ? history.byId[history.allIds[0]] : {};
    return  {
        "startedDateTime": "2009-04-16T12:07:23.596Z", //request start date
        "time": 50, //total time
        "request": requestObject(request),
        "response": responseObject(response),
        "cache": {}, //cache if used (always blank in our case)
        "timings": timingObject(response), //the tim
        "serverIPAddress": response ? response.remoteAddress : "",
        "connection": response ? response.remotePort : "",
        "comment": ""
    }
}


function queryStringObject(qs){
    const {name, value, comment } = qs;
    return {
        name, value, comment
    }
}

function queryStringFromRequest(request){
    const qsIds = request.qs.allIds;
    return qsIds.map((queryId)=>{
        return queryStringObject(request.qs.byId[queryId])
    });
}

function headersFromRequest(request){
    const headerIds = request.headers.allIds;
    return headerIds.map((headerId)=>{
        return headersObject(request.headers.byId[headerId]);
    })
}

function headersObject(header){
    const {name, value, comment} = header;
    return  { name, value, comment }
}

function cookiesFromResponseHeaders({headers}){
    const cookieHeader = Object.keys(headers).find((header)=>{
        return header.toLowerCase() === "set-cookie"
    });
    return cookieHeader ?
        Cookie.parse(headers[cookieHeader]).map((cookie)=>{
            const {key, value, expires, maxAge, domain, path, secure, httpOnly, creation} = cookie;
            return {
                name: key,
                value,
                path,
                domain,
                expires,
                httpOnly,
                secure,
            }
        }) : []
}

function headersFromResponseObject({headers}){
    return Object.keys(headers).map((item)=> ({name: item, value: headers[item]}))
}

function postData(){
    return  {
            "mimeType": "multipart/form-data",
            "params": [], //either this or text
            "text" : "plain posted data",
            "comment": ""
    }
}

function postDataParams(){
    return  {
        "name": "paramName",
        "value": "paramValue",
        "fileName": "example.pdf",
        "contentType": "application/pdf",
        "comment": ""
    }
}
function responseObject(response){
    const {status, httpVersion} = response;
    return {
        status,
        "statusText": "OK",
        httpVersion,
        "cookies": cookiesFromResponseHeaders(response),
        "headers": headersFromResponseObject(response),
        "content": {},
        "redirectURL": "",
        "headersSize" : -1,
        "bodySize" : -1,
        "comment" : ""
    }
}

function responseContentObject(){
    return  {
        "size": 33,
        "compression": 0,
        "mimeType": "text/html; charset=utf-8",
        "text": "\n",
        "comment": ""
    }
}

function cookieObject(){
    return  {
        "name": "TestCookie",
        "value": "Cookie Value",
        "path": "/",
        "domain": "www.janodvarko.cz",
        "expires": "2009-07-24T19:20:30.123+02:00",
        "httpOnly": false,
        "secure": false,
        "comment": ""
    }
}



function requestObject(request){
    const {method, url, comment} = request;
    return {
        method,
        url,
        "httpVersion": "HTTP/1.1",
        "cookies": [],
        "headers": headersFromRequest(request),
        "queryString" : queryStringFromRequest(request),
        "postData" : {},
        "headersSize" : 150,
        "bodySize" : 0,
        comment
    }
}

function timingObject({timingPhases}){
    return timingPhases ? {
        "blocked": 0,
        "dns": timingPhases.dns,
        "connect": timingPhases.tcp,
        "send": timingPhases.wait + timingPhases.dns - timingPhases.tcp, //required
        "wait": timingPhases.firstByte, //required
        "receive": timingPhases.download, //required
        "ssl": -1,
        "comment": ""
    } : {}
}

function requestToHar(){

}

function requestFromHar(){

}
function projectFromHar(){

}
