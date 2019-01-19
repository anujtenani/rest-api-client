var express = require('express');
var router = express.Router();
const fetch = require('node-fetch'); //TODO replace with request to get better support for cookies and timing
const {DataUriToBlob } = require('../fetch/blobfunc');
const {charsetFromHeaders, getHeader} = require('../fetch/mimefunc');

router.post('/', async (req, res)=>{
    const {url, method, body} = req.body;
    const reqHead = req.body.headers;
    const requestObject = {
        method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        reqHead,
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    };
    const {bodyType, data} = body;
    switch (bodyType) {
        case "multipart":
        case "binary":
        case "multipart/form-body":
            requestObject.body = DataUriToBlob(data);
            break;
        default:
            requestObject.body = data;
    }
    try {
        const startTime = new Date().getTime();
        const response = await fetch(url, requestObject);
        const endTime = new Date().getTime();
        const {headers, statusCode, statusText, body, bodySize} = await parseResponseObject(response);
        res.send({
            headers, statusCode, statusText, body, href:url, method, bodySize, startTime, endTime,
            requestHeaders: Object.keys(reqHead).map((name)=> { return { name,  value: reqHead[name]}}),
        })
    }catch(e){
        console.log(e);
        res.send({error: {message: e.toLocaleString() || 'Network error', url, method}})
    }

})



async function parseResponseObject(response){
    const {headers , status, statusText } = response;
    const h = [];
    for (let pair of headers.entries()) {
        h.push({name:pair[0], value:pair[1]});
    }
    const buffer = await response.buffer(); //nodejs-fetch extension
    const contentType = getHeader('content-type', headers.raw());
    const charset = charsetFromHeaders(headers.raw());
    const body = charset ? buffer.toString('utf-8') : `data:${contentType};base64,${buffer.toString('base64')}`
    return {headers:h, statusCode: status, statusText, body, bodySize: buffer.byteLength};
}

module.exports = router;
