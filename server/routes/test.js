var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer')
const upload = multer({ dest:'files/' });


router.get('/html', (req, res, next)=>{
    res.cookie('hello', 'world',{ maxAge: 900000, httpOnly: false });
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


router.post('/image', upload.array('image', 5), (req, res, next)=>{

    console.log(req.files);
    res.send(req.files);
})
module.exports = router;
