const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'GET':
            if (isFileInNestedFolder(pathname)) {
                res.statusCode = 400;
                res.end('Nested folders are not supported');
                return;
            }

            fs.createReadStream(filepath)
                .on('error', (error) => {
                    if ((error.code = 'ENOENT')) {
                        res.statusCode = 404;
                        res.end('The file was not found');
                        return;
                    }
                    res.statusCode = 500;
                    res.end('Internal server error');
                })
                .pipe(res);
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
