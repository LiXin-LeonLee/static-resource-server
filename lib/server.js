// 子进程：响应单个文件请求的静态资源服务器

var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path');

var mime = {
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png'
}

// 返回文件路径和 MIME 类型
function getFileInfo(rootPath, reqUrl) {
    var pathName = url.parse(reqUrl).pathname,
        extname = path.extname(pathName);
    return {
        filePath: rootPath + pathName,
        mime: mime[extname]
    }
}

// 验证文件是否存在
function validateFile(filePath, callback) {
    fs.access(filePath, (err) => {
        err ? callback(err) : callback(null, filePath);
    });
}

function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0]));

    // 静态资源根目录，监听端口，主机
    var rootPath = config.rootPath || './',
        port = config.port || '8080',
        host = config.host || '127.0.0.1';

    // 先判断文件是否存在，做出响应
    var staticServer = http.createServer((req, res) => {
        fileInfo = getFileInfo(rootPath, req.url);
        validateFile(fileInfo.filePath, (err, filePath) => {
            if (err) {
                res.writeHead(404);
                res.end(err.message);
            } else {
                res.writeHead(200, { 'Content-Type': fileInfo.mime });
                fs.createReadStream(filePath).pipe(res);
            }
        });
    });

    staticServer.listen(port, host);

    // 关闭服务，退出进程
    process.on('SIGTERM', () => {
        staticServer.close(() => {
            process.exit(0);
        });
    });
}

main(process.argv.slice(2));
