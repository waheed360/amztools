const express = require('express')
const app = express();

const color = require('colors')


app.use(express.static('./public'))

const routes = require('./routes');
app.use('/', routes);

// app.set('views', './views')
app.set('view engine', 'pug')

app.listen(8000,() => {
    console.log("Listening on Port 8000")
})
