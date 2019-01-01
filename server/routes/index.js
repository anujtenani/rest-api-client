require("@babel/register")({});
var express = require('express');
var router = express.Router();
const request = require('request');
const path = require('path');
const fs = require('fs');
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
    res.sendFile(path.join(__dirname, '..','..','build','index.html'));
    //res.send("ok")
});

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
   const {url, method, headers, body} = req.body;
   try {
       const response = await execute({
           url, method, headers, body
       });
       console.log(response);
       res.send(response)
   }catch(e){
       console.log(e);
       res.send({})
   }

});

function execute(req){
    //ideally we should be using piping/streaming (study more)
    return new Promise((resolve, reject)=>{
        let requestData = '';
        let remoteAddress, remotePort;
        console.log(req);
        request({...req, time:true}, (err, httpResponse, body)=>{
            //console.log(httpResponse);
            if(err){
                console.log(err);
                if(err.code){
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
                err, timingPhases, body
            })
        }).on('socket', function(socket) {
            remoteAddress=  socket.remoteAddress;
            remotePort = socket.remotePort;
        });
    })
}


module.exports = router;
