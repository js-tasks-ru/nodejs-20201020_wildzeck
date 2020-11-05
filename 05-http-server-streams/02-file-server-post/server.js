const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');
const limitedStream = new LimitSizeStream({ limit: 1000000 });

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'POST':
            if (isFileInNestedFolder(pathname)) {
                res.statusCode = 400;
                res.end('Nested folders are not supported');
                return;
            }

            const writeStream = fs.createWriteStream(filepath, {
                flags: 'wx',
            });

            req.pipe(limitedStream)
                .on('error', (error) => {
                    if (error.code === 'LIMIT_EXCEEDED') {
                        res.statusCode = 413;
                        res.end('File is too big');
                        return;
                    }

                    res.statusCode = 500;
                    res.end('Internal server error');
                })
                .on('close', async () => {
                    if (res.finished) {
                        await deleteTheFile(filepath);
                        stream.destroy();
                        return;
                    }
                })
                .pipe(writeStream)
                .on('error', (error) => {
                    if (error.code === 'EEXIST') {
                        res.statusCode = 409;
                        res.end('Conflict');
                        return;
                    }

                    res.statusCode = 500;
                    res.end('Internal server error');
                })
                .on('close', async () => {
                    if (res.finished) {
                        await deleteTheFile(filepath);
                        stream.destroy();
                        return;
                    }
                })
                .on('end', () => {
                    res.statusCode = 201;
                    res.end('Created');
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

function deleteTheFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

module.exports = server;
