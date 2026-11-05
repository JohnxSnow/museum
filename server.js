// Simple zero-dependency HTTP server to serve the 3D Virtual Art Gallery
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

let PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.on('error', (err) => {
  if ((err.code === 'EACCES' || err.code === 'EADDRINUSE') && PORT < 3010) {
    PORT += 1;
    console.log(`Port busy or restricted, trying port ${PORT}...`);
    server.listen(PORT, '0.0.0.0');
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`🏛️  مۆزەخانەی شاهانەی 3D (٥٦ شاکاری ڕاستەقینە، سوریالیزم و کەلەپوور) کارا کرا!`);
  console.log(`💻  لەسەر کۆمپیوتەر: http://localhost:${PORT}`);
  console.log(`📱  لەسەر مۆبایل (هەمان وایفای): http://${localIp}:${PORT}`);
  console.log(`======================================================\n`);
});
