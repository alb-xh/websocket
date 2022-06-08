const express = require('express');

const server = express();

server.use('/', express.static(__dirname + '/public'));

server.listen(3000, () => {
  console.log('Client started!');
});
