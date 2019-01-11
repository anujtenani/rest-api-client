//import * as app from '../../../package';
import Cookie from 'tough-cookie';
//const Cookie = require('tough-cookie');
const app = {
    name:"",
    version:"",
    description:"",
}
//source https://github.com/ahmadnassri/har-spec/blob/master/versions/1.2.md
export function doExport(state){
    const harTemplate = {
        "version" : "1.2", //the har version
        "creator" : {
            "name":app.name, //app name
            "version": app.version, //app version
            "comment": app.description
        },
        "browser" : {},
        "pages": [],
        "entries": [],
        "comment": state.metadata.comment || state.metadata.name
    }
    harTemplate.entries = state.requests.allIds.filter((requestId)=>{
        return state.requests.byId[requestId].type === "rest"; //filter requests other than REST as HAR does not support other request types
    }).map((requestId)=>{
        return createEntryFromRequest(state.requests.byId[requestId])
    })
    return {log: harTemplate };
}

function createEntryFromRequest(request){
    const {history} = request;
    const response = history.allIds.length > 0 ? history.byId[history.allIds[0]] : {};
    return  {
        "startedDateTime": "2009-04-16T12:07:23.596Z", //request start date
        "time": 50, //total time spent in request, obtained by summing the timings
        "request": requestObject(request),
        "response": responseObject(response),
        "cache": {}, //cache if used (always blank in our case)
        "timings": timingObject(response), //the tim
        "serverIPAddress": response ? response.remoteAddress : "",
        "connection": response ? response.remotePort : "",
        "comment": request.name
    }
}


function queryStringObject(qs){
    const { name, value, comment } = qs;
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

function postDataFromRequest(request){
    switch (request.body.bodyType) {
        case "text":
        case "binary":
        case "json":
            return {
                mimeType:"text/plain",
                text:request.body.data,
                comment: request.body.comment
            }
        case "multipart":
            return {
                mimeType:"multipart/form-data",
                params: buildPostDataParams(request),
                comment:'',
            }
        case "form":
            return {
                mimeType:"application/x-www-urlformencoded",
                params: buildPostDataParams(request),
                comment:'',
            }
        default:
            return {}
    }
}

function buildPostDataParams(request){
    return request.body.allIds.map((bodyId)=>{
        const {name, value, comment,fileName, size, contentType} = request.body.byId[bodyId];
        return {
            name, value, fileName, contentType, comment
        }
    });

}

/*
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
*/
function responseObject(response){
    const {status, httpVersion, statusText} = response;
    const content = contentFromResponseBody(response);
    return {
        status,
        statusText,
        httpVersion,
        "cookies": cookiesFromResponseHeaders(response),
        "headers": headersFromResponseObject(response),
        content,
        "redirectURL": "",
        "headersSize" : -1,
        "bodySize" : content.size,
        "comment" : ""
    }
}

function contentFromResponseBody(response){
    const text = response.body;
    const findHeader = (headerName) => response.headers.find(({name, value})=>{
        return name.toLowerCase() === headerName.toLowerCase()
    }) || {};

    const compression = findHeader('content-encoding').value || '';

    return {
        text,
        mimeType: findHeader('content-type').value || '',
        size: findHeader('content-length').value || 0,
        compression: compression.includes('gzip') ? 1 : 0
//        size:
    }
}


/*
function responseContentObject(){
    return  {
        "size": 33,
        "compression": 0,
        "mimeType": "text/html; charset=utf-8",
        "text": "\n",
        "comment": ""
    }
}
*/
/*
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
*/



function requestObject(request){
    const {method, url, comment, path} = request;
    //create url
    const pathname = path ? path.allIds.map((pathId)=>{
        const {value} = path.byIds[pathId];
        return value;
    }).join("/") : '';

    return {
        method,
        url: url+pathname,
        "httpVersion": "HTTP/1.1",
        "cookies": [],
        "headers": headersFromRequest(request),
        "queryString" : queryStringFromRequest(request),
        "postData" : postDataFromRequest(request),
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
