// 守护进程

var cp = require('child_process');

var worker;
var num = 0;

// 开启服务器子进程，并在服务器意外退出时重启服务器
function spawn(serverPath, config) {
    worker = cp.spawn('node', [serverPath, config]);
    worker.on('error', (err) => {
        console.log(err);
    })
    worker.on('close', (code) => {
        if (code !== 0 && num < 5) {
            console.log(code);
            console.log('static server restart');
            num++;
            spawn(serverPath, config);
        }
    });
}

function main(argv) {
    spawn('server.js', argv[0]);

    // 守护进程在接收到 SIGTERM 信号时终止服务器进程
    process.on('SIGTERM', () => {

        // subprocess.kill() 方法向子进程发送一个信号
        // 如果没有给定参数，则进程会发送 'SIGTERM' 信号
        worker.kill();

        // process.exit() 方法以结束状态码 code 指示 Node.js 同步终止进程
        process.exit(0);
    });
}

// Startws command: node ../lib/daemon.js ../conf/config.json
main(process.argv.slice(2));