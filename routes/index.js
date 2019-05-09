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
    filename: (req, file, cb) => {
        cb(null,file.fieldname + '.' + Date.now() + path.extname(file.originalname))
    }
});

//setup upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000000 }, //size in bytes
    fileFilter: (req, file, cb) => {
            checkFileType(file,cb);
    }
}).single('ufile')

//check the checkFileType
function checkFileType(file,cb){
    //allowed extensiions
    const filetypes = /csv/;
    //check
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mimetype
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && ext){
        return cb(null,true)
    } else {
        return cb ('Error: File must be .csv', false)
    }
}

//TODO: this is broken
router.post('/import', (req, res) => {
    upload(req, res, (err) => {
        err = req.file ? null : 'Error: No File Uploaded';
        if(err) {
            res.render('index',{
                message: 'Please select csv to upload',
                error: err
            })
        } else {
            return res.send('Received the request')
        }
    })
});

module.exports = router;
