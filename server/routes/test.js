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


router.post('/image', upload.single('image'), (req, res, next)=>{
    console.log(req.file.path);
    res.header({'Content-Type':'image/png'});
    res.sendFile(path.join(__dirname, '..', '..',req.file.path));
//    res.send({"hasfile":"f","result":req.file});
})
module.exports = router;
