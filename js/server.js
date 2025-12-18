// Configuration for local HTTP server
// Basic server first: 
const http = require('http');
const hostname = 'localhost';
const port = 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('Hello, Centurion! Welcome to my Node.js server for Apex (Demo-website).\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});