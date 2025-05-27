const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const createHandler = require('./handler');

const hostname = '127.0.0.2';
const port = 3000;


let server = createServer(createHandler);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
