# 静态资源服务器

A static  resource server based on Node.js.

> 地址：[http://assets.ifight.xyz](http://assets.ifight.xyz)
>
> 不可避免同域下 HTTP 请求的限制



## 开发环境

* Ubuntu 16.04
* node.js 8.11.1



## 功能

* [x] 提供静态资源的服务器
* [x] 守护进程可重启静态资源服务器
* [x] 配置化管理
* [ ] 控制脚本（**存在 bug**）



## 扩展

* [ ] 形成错误日志



## 控制脚本说明（bug）

> -f 参数判断 pid 文件是否存在
>
> & 表示直接返回 shell 的界面, 不需要等待命令结束,直接开始接收下一个命令
> 
> $! shell 最后运行的后台进程的 PID

```shell
#！/bin/bash
if [ ! -f "pid" ]
then
    node ../lib/daemon.js ../conf/config.json &
    echo $! > pid
fi
```

> < 将输入重定向到 file
> 
> tr 指令从标准输入设备读取数据，经过字符串转译后，将结果输出到标准输出设备
> 
> -d, --delete：删除指令字符
> 
> $() 语句给变量赋值
> 
> rm 删除文件


```shell
#!/bin/bash
if [ -f "pid" ]
then
    kill $(tr -d '\r\n' < pid)
    rm pid
fi
```



## 参考资料

* [七天学会NodeJS](https://nqdeng.github.io/7-days-nodejs/)



# 展示页面

> gh-pages



## 功能

* [ ] 获取图片作为背景图
* [ ] 获取 .css/.js/.png 资源，并展示
* [ ] 获取 .md