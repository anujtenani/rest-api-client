var express = require('express');
var router = express.Router();
const request = require('request');
const fs = require('fs');
const path = require('path');
var multer  = require('multer');
var crypto = require('crypto');
const faker = require('faker');
const {v4, v1} = require('uuid');
const shortId = require('shortid');
const upload = multer({ dest:'files/' });
/*
No longer used as file is stored in the state object client side only
//upload file
router.post('/file', upload.single('file'), (req, res, next)=>{
    const {file} = req;
    res.send({fileId:file.filename, ...file})
});
//cleanup
router.delete('/file/:fileId', (req, res, next)=>{
    const {fileId} = req.params;
    const f = path.join(__dirname, '..','files',fileId);
    if(fs.existsSync(f)){
        fs.unlinkSync(f);
    }
    res.send({fileId, success:true})
});
*/


router.get('/hash/:algo/:data', (req, res, next)=>{
    const {data, algo} = req.params;
    const hash = crypto.createHash(algo).update(String(data)).digest("hex");
    console.log(hash);
    res.send(hash);
});

router.post('/hmac/:algo/:key/:data', (req, res, next)=>{
    const {data, key, algo} = req.body;
    const hash = crypto.createHmac(algo, key).update(String(data)).digest('hex')
    res.send(hash);
});

router.post('/hash', (req, res, next)=>{
    const {data, algo} = req.body;
    const hash = crypto.createHash(algo).update(String(data)).digest("hex");
    res.send(hash);
});

router.post('/hmac', (req, res, next)=>{
    const {data, key, algo} = req.body;
    const hash = crypto.createHmac(algo, key).update(String(data)).digest('hex')
    res.send(hash);
});

router.get('/uuid/:variant', (req, res, next)=>{
    const {variant} = req.params;
    switch (variant) {
        case "v1":
            res.send(v1());
            break;
        default:
            res.send(v4());
    }
});

router.get('/faker/:key/:func/:locale?', (req, res, next)=>{
    const {key, func, locale} = req.params;
    console.log(key, func);
    res.send(faker[key][func]());
})


module.exports = router;
