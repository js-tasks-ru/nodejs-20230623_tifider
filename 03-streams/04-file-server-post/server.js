const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (filepath.includes('/', filepath.indexOf('files/') + 6)) {
        res.statusCode = 400;
        res.end('Nested directories are not supported.');
        break;
      }

      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end();
        break;
      }

      const limitedStream = new LimitSizeStream({limit: 1048576});
      const stream = fs.createWriteStream(filepath);

      req.pipe(limitedStream).pipe(stream);

      stream.on('close', () => {
        res.statusCode = 201;
        res.end();
      });

      stream.on('error', (error) => {
        console.error(error);
      });

      limitedStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          fs.unlink(filepath, (err) => {
            if (err) throw err;

            console.log(`File ${filepath} was deleted.`);
          });

          res.statusCode = 413;
          res.end();
        }
      });

      req.on('aborted', () => {
        console.log('Connection was aborted.');
        fs.unlink(filepath, (err) => {
          if (err) throw err;

          console.log(`File ${filepath} was deleted.`);
        });
        limitedStream.destroy();
        stream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
