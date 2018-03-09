const SourceCode = require("./libs/sourceCodetest");
const fs = require("fs");


class webpackReasyTestToolPlugin {
	constructor(options) {
		if(!options.hasOwnProperty("htmlEn")){
			options.htmlEn = true;
		} 
		if(!options.hasOwnProperty("cssEn")){
			options.cssEn = true;
		}
		this.options = options;
		
		if(!this.options.path){
			throw new Error("(没有配置path属性)----by----reasy-sourcecode-test-webpack-plugin");
		}else{
		  if(!fs.existsSync(this.options.path)){
			throw new Error(`(${path}文件夹不存在)----by----reasy-sourcecode-test-webpack-plugin`);
		  }
		}
	}
}

webpackReasyTestToolPlugin.prototype.apply = function (compiler) {
	//compiler是webpack的一个编译器对象，可以通过此对象监听编译期间的相应动作
	//然后在发生各种动作的时候进行一些操作
	//这个插件用于源码检查，所以任何时候都可以做检查
	//compile事件，webpack开始编译时触发
	//
	this.options.rootPath = compiler.options.context;
	sourceCode = new SourceCode(this.options.path, this.options);
	/**
	 * 源代码检查
	 * 1.编码规范检查
	 * 2.兼容性css、html、js处理
	 * 3.翻译是否成功检查  todo
	 * 4.源代码是否有中文检查 todo
	 */
	sourceCode.test();
	// compiler.plugin("compile", () => {
	
	// });

	// emit（'编译器'对'生成最终资源'这个事件的监听）
	// compiler.plugin("emit", function (compilation, callback) {
	// 	console.log("The compilation is going to emit files...");
	// 	console.log(compilation.chunks[0]);
	// 	compilation.chunks.forEach(function (chunk) {
	// 		// chunk.modules是模块的集合（构建时webpack梳理出的依赖，即import、require的module）
	// 		// 形象一点说：chunk.modules是原材料，下面的chunk.files才是最终的成品
	// 		chunk.modules.forEach(function (module) {
	// 			// module.fileDependencies就是具体的文件，最真实的资源【举例，在css中@import("reset.css")，这里的reset.css就是fileDependencie】
	// 			module.fileDependencies.forEach(function (filepath) {
	// 				console.log(filepath);
	// 				// 到这一步，就可以操作源文件了
	// 			});
	// 		});
	// 	});
	// });

}

module.exports = webpackReasyTestToolPlugin;