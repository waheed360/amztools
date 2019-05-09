const _ = require('lodash');
const nodemon = require('nodemon');
const color = require('colors');


function startServer() {
    console.log('>> Starting server <<'.green);
    appProcess = nodemon({
      script: 'app.js',
      inspect: true,
    });
}
function stopServer() {
  nodemon.emit('quit');
}
startServer();
