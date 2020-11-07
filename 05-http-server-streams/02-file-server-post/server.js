const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const LimitSizeStream = require('./LimitSizeStream');

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

            const limitedStream = new LimitSizeStream({ limit: 1000000 });
            const writeStream = fs.createWriteStream(filepath, {
                flags: 'wx',
            });

            req.pipe(limitedStream)
                .on('error', async (error) => {
                    if (error.code === 'LIMIT_EXCEEDED') {
                        res.statusCode = 413;
                        res.end('File is too big');
                        await deleteTheFile(filepath);
                        return;
                    }

                    res.statusCode = 500;
                    res.end('Internal server error');
                    await deleteTheFile(filepath);
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
                    deleteTheFile(filepath);
                })
                .on('close', () => {
                    res.statusCode = 201;
                    res.end('Created');
                });
            res.on('close', async (err) => {
                if (res.finished) return;
                await deleteTheFile(filepath);
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
