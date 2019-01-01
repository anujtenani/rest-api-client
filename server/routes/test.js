var express = require('express');
var router = express.Router();
const path = require('path');


router.get('/html', (req, res, next)=>{
    res.cookie('hello', 'world');
    res.cookie('cookie', 'monster');
    res.send('<html>' +
        '<head></head>' +
        '<body>Hello world</body>' +
        '</html>')
})


router.get('/text', (req, res, next)=>{
    res.header('Content-Type', 'text/plain')
    res.send('Hello world')
})
router.get('/json', (req, res, next)=>{
    res.send({success: true})
})

router.get('/jpg', (req, res, next)=>{
    res.sendFile(path.join(__dirname,'..','testdata','image.jpg'))
});

module.exports = router;
