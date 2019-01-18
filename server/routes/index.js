import store from '../store';
var express = require('express');
var router = express.Router();
const request = require('request');
const path = require('path');
const fs = require('fs');
const URL = require('url').URL;
const Datauri = require('datauri');
var mime = require('mime-types')
var dataUriToBuffer = require('data-uri-to-buffer');
const {applyActionsToStore} = require('../functions');

// const {createStore} = require('redux');
// const rootReducer = require('../../src/redux/rootReducer').default;
/*
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.join(process.cwd(), 'database.db'));

db.serialize(function() {
    db.run("CREATE TABLE IF NOT exists projectActions (projectId TEXT, timestamp NUMBER, action TEXT)");

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();
*/




router.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname, '..','..','build','index.html'));
    //res.send("ok")
    res.send('ok');
});

router.post('/apply_action', async (req, res)=>{
    const action = req.body;
    const user_id = req.headers.user;
    const project_id = req.headers.project;
    const state = await applyActionsToStore([action], user_id, project_id);
    res.send(state);
})

router.get('/save',(req, res)=>{
    res.send('save');
});

router.post('/save', function(req, res, next){
   /*
    const store = createStore(rootReducer);
    const storeJson = store.getState();
//    console.log(storeJson);
    //save this state to database or file
//    fs.writeFileSync(path.join(__dirname,'..','testdata','store.json', JSON.stringify(storeJson), 'utf-8'))
    */
    res.send({saved:true});
});


//this instance should be protected if flag is remote
router.post('/call', async (req, res, next)=>{
   const {url, method, headers, body, qs} = req.body;
   try {
        const requestObject = {url, method};
        if(headers) requestObject.headers = headers;
        if(qs) requestObject.qs = qs;
       //convert body to actual data;
       //body is an edge case as binary data is submitted as base64 which needs to be converted back
       const {bodyType, byId, allIds, text} = body;
       switch (bodyType) {
           case "text":
           case "json":
               requestObject.body = text;
               break;
           case "binary":
               requestObject.body = dataUriToBuffer(text);
               break;
           case "form":
               requestObject.form = createFormFromBody(body);
               break;
           case "multipart":
                requestObject.formData =  createFormDataFromBody(body);
       }
       console.log(requestObject);
       const startTime = new Date().getTime();
       const response = await execute(requestObject);
       const endTime = new Date().getTime();
       res.send({...response, startTime, endTime})
   }catch(e){
       console.log(e);
       res.send({})
   }

});

function createFormDataFromBody({byId, allIds}){
    const formData = {};
    allIds.forEach((id)=>{
        const {name, value, inputType, fileName, size, type} = byId[id];
        const val = inputType === "file" ? {
                value: dataUriToBuffer(value),
                options:{
                    filename: fileName,
                    knownLength:size,
                    contentType: type
                }
            }: value;
        if(!formData[name]) formData[name] = [];
        //create and push in an array so that multiple multipart field with same name can be taken care of
        formData[name].push(val);
    });
    Object.keys(formData).forEach((item)=>{
        //now create single fields into regular object thereby keeping multiple same name fields as array
        if(formData[item].length === 1){
            formData[item] = formData[item][0];
        }
    });
    return formData;
}

function createFormFromBody({byId, allIds}){
    const form = {};
    allIds.forEach((id)=>{
        const {name, value} = byId[id];
        form[name] = value;
    });
    return form
}

/*
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        return Buffer.from(dataURI.split(',')[1], 'base64'); //atob is not available in nodejs use native decoding
//        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

*/

function execute(req){
    //ideally we should be using piping/streaming (study more)
    return new Promise((resolve, reject)=>{
        let requestData = '';
        let remoteAddress, remotePort;
        console.log(req);
        //encoding is null so that returned body is a buffer
        // buffer is changed to string if charset=UTF-8 or content-type is one of text/* or application/json or application/xml
        request({...req, time:true, encoding: null}, (err, httpResponse, body)=>{
            console.log(body);
            if(err){
                console.log(err);
                if(err.code){
                    let {code, errno, syscall, port, hostname, host} = err;
                    if(!hostname ||!host){
                        const url = new URL(req.url);
                        hostname = url.hostname;
                        host = url.host
                    }
                    resolve({err: {code, errno, syscall, port,hostname, host, message:err.toString()}})
                }
                return resolve({err: err.toString()});
            }
            const {method, formData, path, host, href} = httpResponse.request;
            const requestHeaders = httpResponse.request.headers;
            const {headers, statusCode, timingPhases, httpVersion, socket, timingStart} = httpResponse;
            if(socket.remoteAddress){
                remoteAddress = socket.remoteAddress;
                remotePort = socket.remotePort;
            }
            resolve({
                href,
                method, //formData,
                requestHeaders,
                headers, statusCode, httpVersion,
                remoteAddress, remotePort,
                err, timingPhases, body: isBodyString(headers) ? body.toString('utf-8') : toDataUri(body, headers)
            })
        }).on('socket', function(socket) {
            remoteAddress=  socket.remoteAddress;
            remotePort = socket.remotePort;
        });
    })
}

function toDataUri(body, headers){
    const datauri = new Datauri();
    const contentTypeHeaderKey = Object.keys(headers).find((header)=>header.toLowerCase() === "content-type");
    console.log("got key", contentTypeHeaderKey);
    const contentType = headers[contentTypeHeaderKey];
    datauri.format('.'+mime.extension(contentType), body);
    return datauri.content;
}

function isBodyString(headers){
    console.log(headers);
    const contentTypeHeaderKey = Object.keys(headers).find((header)=>header.toLowerCase() === "content-type");
    console.log("got key", contentTypeHeaderKey);
    const contentType = headers[contentTypeHeaderKey];
    return mime.charset(contentType);
}


module.exports = router;
