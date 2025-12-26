// Configuration for local HTTP server 
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async(req, res) => {
    try {
        let filePath;

        if (req.url === '/') {
            filePath = path.join(__dirname, '..', 'index.html');

        } else if (req.url.startsWith('/css/')) {
            // css folder is at project root -- same as js & public folder
            filePath = path.join(__dirname, '..', req.url);

        } else if (req.url.startsWith('/js/')) {
            // js folder is at project root -- same as css & public folder
            filePath = path.join(__dirname, '..', req.url);

        } else if (req.url.startsWith('/images/')) {
            filePath = path.join(__dirname, '..', 'public', req.url);

        } else if (req.url.startsWith('/assets/')) {
            filePath = path.join(__dirname, '..', 'public', 'images', req.url);


        } else if (req.url.startsWith('/contact/')) {
            filePath = path.join(__dirname, '..', 'public', 'images', req.url);

        } else if (req.url.startsWith('/services/')) {
            filePath = path.join(__dirname, '..', 'public', 'images', req.url);

        } else if (req.url.startsWith('/fonts/')) {
            filePath = path.join(__dirname, '..', 'public', req.url);
                
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h1>404 Not Found </h1>');
            return;
        }
        
        
        const content = await fs.readFile(filePath);
        const contentType =  getContentType(filePath);
        res.writeHead(200, {'Content-Type': contentType});
        res.end(content);

    } catch (error) {
        console.error('Error:', error.message, 'Path:', filePath);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
});

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css':  return 'text/css; charset=utf-8';
    case '.js':   return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png':  return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif':  return 'image/gif';
    case '.svg':  return 'image/svg+xml';
    case '.woff': return 'font/woff';
    case '.woff2':return 'font/woff2';
    default:      return 'application/octet-stream';
  }
}

// Console status for dev tools: 
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});