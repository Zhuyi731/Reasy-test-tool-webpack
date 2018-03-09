var fs = require("fs");

var path = require("path");

var rd = require("readline");

var syncTask = require("./../common/syncTask");

var HTMLHint = require("htmlhint").HTMLHint;

var htmlCheck = require("./htmlTest");

var cssCheck = require("./cssTest");

var htmlCheckOptions,
    cssCheckOptions,
    jsCheckOptions,
    checkOptions;

var err = false;

function souceCode(fPath, webpackOptions) {
    var that = this;
    this.options = webpackOptions;
    /*
    *检查是否有自定义配置项
    */
    if (fs.existsSync(webpackOptions.rootPath + "/rSourceTest.config.js")) {
        console.log("*****Detected configure file,use custom*****");
        checkOptions = require(webpackOptions.rootPath + "/rSourceTest.config");
    } else {
        console.warn("*****Didn't find configure file,use default*****");
        checkOptions = require("./../common/checkConfig");
    }

    if (!checkOptions.htmlCheckOptions || !checkOptions.cssCheckOptions) {
        throw new Error("/*****缺少HTML配置项htmlCheckOptions或者CSS检查配置项cssCheckOptions*****/");
        this.test = () => { returnn; };
    }

    htmlCheckOptions = checkOptions.htmlCheckOptions;
    cssCheckOptions = checkOptions.cssCheckOptions;
    //jsCheckOptions = checkOptions.jsCheckOptions;

    this.htmlList = new Array();
    this.cssList = new Array();
    this.jsList = new Array();
    this.test = function () {
        //获取当前目录的绝对路径
        var filePath = path.resolve(fPath);

        //获取所有js、css、html文件路径
        that.getFileList(filePath);

        //等待获取完所有文件后再测试文件
        setTimeout(function () {
            // syncTask是为了让这些检查能够同步的执行，而不是异步的
            if (that.options.htmlEn) {
                //  检查html文件源码规范
                syncTask.push({
                    "beforeRun": function () { console.log("/******开始html文件检查******/"); },//运行之前的函数
                    "task": htmlCheck,//任务函数  
                    "args": [that.htmlList, htmlCheckOptions],//任务函数の参数
                    "callback": function (errNum) {//回调
                        console.log("共发现了" + errNum + "个错误");
                        if (errNum > 0) {
                            return new Error("发现HTML文件错误，请检查后再编译");
                        }
                    },
                    "afterRun": function () {
                        console.log("/******html文件检查结束******/");
                        console.log("");
                    }
                }
                );
            }
            if (that.options.cssEn) {
                //检查css文件源码规范
                syncTask.push({
                    "beforeRun": function () { console.log("/******开始css文件检查******/"); },//运行之前的函数
                    "task": cssCheck,//任务函数  
                    "args": [that.cssList, cssCheckOptions],//参数
                    "callback": function (errNum) {//回调
                        console.log("共发现了" + errNum + "个错误");
                    },
                    "afterRun": function () {
                        console.log("/******css文件检查结束******/");
                    }
                });
            }
            // //检查js文件源码规范
            // syncTask.push({
            //     "beforeRun":function(){console.log("/******开始js文件检查******/")},//运行之前的函数
            //     "task": jsCheck,//任务函数  
            //     "args": [that.jsList, jsCheckOptions],//参数
            //     "callback": function (errNum) {//回调
            //         console.log("共发现了" + errNum + "个错误");
            //     },
            //     "afterRun":function(){
            //         console.log("/******js文件检查结束******/")
            //     }
            // })
            syncTask.run();
        }, 3000);
    };

    /**
     * 获得代码路径下的所有文件路径
     * @param(filePath)  代码路径
     */
    this.getFileList = function (filePath) {
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err);
            } else {
                //遍历读取到的文件列表
                files.forEach(function (fileName) {
                    //获得绝对路径
                    var fileDir = path.join(filePath, fileName);
                    //获取文件信息
                    fs.stat(fileDir, function (error, stats) {
                        if (error) {
                            console.log("获取文件" + fileName + "信息失败");
                        } else {
                            //当前路径是文件
                            if (stats.isFile()) {
                                if (webpackOptions.exclude && webpackOptions.exclude.test(fileDir)) {
                                    //如果是不需要做检测的库则不作处理
                                } else {
                                    //分类归如地址数组中
                                    //exclude 排除
                                   
									if(that.options.exclude && that.options.exclude.test(fileDir)){
										
									   return ;
                                    }

                                    if ((/(\.html|\.htm)$/).test(fileDir)) {
                                        //假数据不要
                                        if (fileDir.indexOf("goform") === -1) {
                                            that.htmlList.push(fileDir);
                                        }
                                    }

                                    if ((/\.js$/).test(fileDir)) {
                                        //公共库js不做检测
                                        if (fileDir.indexOf("libs") === -1) {
                                            that.jsList.push(fileDir);
                                        }
                                    }

                                    if ((/\.css$/).test(fileDir)) {
                                        that.cssList.push(fileDir);
                                    }
                                }
                            }
                            //当前路径是目录,递归
                            if (stats.isDirectory()) {
                                that.getFileList(fileDir);
                            }
                        }
                    });
                });
            }

        });
    };
}

module.exports = souceCode;