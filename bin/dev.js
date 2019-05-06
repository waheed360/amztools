const _ = require('lodash');
const nodemon = require('nodemon');
const color = require('colors');

let appProcess;

function startServer() {
  if (appProcess) {
    console.log('>> Restarting server <<'.green);
    appProcess.restart();
  } else {
    console.log('>> Starting server <<'.green);
    appProcess = nodemon({
      script: 'app.js',
      watch: false,
      inspect: true,
    });
  }
}
function stopServer() {
  nodemon.emit('quit');
  appProcess = null;
}
startServer();
