const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'CSV Upload', message: 'Please select csv to upload' })
});

const path = require('path')
const multer = require('multer');

// setup storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null,file.fieldname + '.' + Date.now() + path.extname(file.originalname))
    }
});

//setup upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1}, //size in bytes
}).single('ufile')


router.post('/import', (req, res) => {
    upload(req, res, (err) => {
        //TODO: this is broken
        if(err) {
            res.render('index',{
                message: err
            })
        } else {
            console.log("lmao")
            console.log(req.file)
        }
    })
    // return res.send('Received the request')

});
module.exports = router;
