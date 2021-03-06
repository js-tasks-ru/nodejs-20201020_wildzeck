const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'DELETE':
            if (isFileInNestedFolder(pathname)) {
                res.statusCode = 400;
                res.end('Nested folders are not supported');
                return;
            }

            fs.unlink(filepath, (err) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        res.statusCode = 404;
                        res.end('Not found');
                    } else {
                        res.statusCode = 500;
                        res.end('Internal server error');
                    }
                } else {
                    res.statusCode = 200;
                    res.end('OK');
                }
            });

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

function isFileInNestedFolder(pathname) {
    return pathname.split('/').length > 1;
}

module.exports = server;
