const express = require('express');
const router = express.Router();
const uuid = require('uuidv4');

router.get('/', (req, res) => {
  res.render('index', { title: 'CSV Upload', message: 'Please select csv to upload' })
});

const path = require('path');
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
const csv = require('csvtojson');

router.post('/import', (req, res) => {
    upload(req, res, async (err) => {
        err = req.file ? null : 'Error: No File Uploaded';
        if(err) {
            res.render('index',{
                message: 'Please select csv to upload',
                error: err
            })
        } else {
            const jsonArray=await csv({includeColumns: /(Shipping |Email|sku|quantity|Name|Subtotal|Financial)/,})
            .fromFile(req.file.path);
            await processFile(req.file.originalname,jsonArray);
            return res.send('Received the request')
        }
    })
});

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
function processFile(fileName,jsonObject) {
    const csvWriter = createCsvWriter({
        path: 'output_files/'+'outfile' + '.' + Date.now() + '.csv',
        // leftside is shopify terms, right side is amazon terms
        header: [
            {id: 'Name', title: 'MerchantFulfillmentOrderID'},
            {id: 'DisplayableOrderID', title: 'DisplayableOrderID'},
            {id: 'DisplayableOrderDate', title: 'DisplayableOrderDate'},
            {id: 'Lineitem sku', title: 'MerchantSKU'},
            {id: 'Lineitem quantity', title: 'Quantity'},
            {id: 'MerchantFulfillmentOrderItemID', title: 'MerchantFulfillmentOrderItemID'},
            {id: 'GiftMessage', title: 'GiftMessage'},
            {id: 'DisplayableComment', title: 'DisplayableComment'},
            {id: 'Subtotal', title: 'PerUnitDeclaredValue'},
            {id: 'DisplayableOrderComment', title: 'DisplayableOrderComment'},
            {id: 'DeliverySLA', title: 'DeliverySLA'},
            {id: 'Shipping Name', title: 'AddressName'},
            {id: 'Shipping Address1', title: 'AddressFieldOne'},
            {id: 'Shipping Address2', title: 'AddressFieldTwo'},
            {id: 'AddressFieldThree', title: 'AddressFieldThree'},
            {id: 'Shipping City', title: 'AddressCity'},
            {id: 'Shipping Country', title: 'AddressCountryCode'},
            {id: 'Shipping Province', title: 'AddressStateOrRegion'},
            {id: 'Shipping Zip', title: 'AddressPostalCode'},
            {id: 'Shipping Phone', title: 'AddressPhoneNumber'},
            {id: 'Email', title: 'NotificationEmail'},
            {id: 'FulfillmentAction', title: 'FulfillmentAction'},
            {id: 'Market', title: 'MarketplaceID'},
        ]

    });

    const records = jsonObject;
    records.forEach((record)=>{
        record.Name =  uuid() + record.Name;
        record.DisplayableOrderID = record.Name;
        record.DisplayableOrderDate = new Date().toISOString().split('.')[0];
        record.Market = 'ATVPDKIKX0DER'
        record.FulfillmentAction = record['Financial Status'] == 'paid' ? 'Ship' : 'Hold';
    })
    csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            console.log('...Done');
        });
}

module.exports = router;
