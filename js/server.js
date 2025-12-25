// Configuration for local HTTP server
// Basic server first: 
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async(req, res) => {
    try {
        if (req.url === '/') {
            const content = await fs.readFile(path.join(__dirname, '..', 'index.html'), 'utf8');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(content);
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h1>404 Not Found </h1>');
        }
    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
});

// Console status for dev tools: 
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});