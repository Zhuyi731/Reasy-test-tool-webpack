const SourceCode = require("./souceCodeTest/sourceCodetest");

class webpackReasyTestToolPlugin{
	constructor(options){
		this.options = options;
	}
}

webpackReasyTestToolPlugin.prototype.apply = function(compiler){
	//compiler是webpack的一个编译器对象，可以通过此对象监听编译期间的相应动作
	//然后在发生各种动作的时候进行一些操作
	//这个插件用于源码检查，所以任何时候都可以做检查
	//compile事件，webpack开始编译时触发
	//

	compiler.plugin("compile",()=>{
		sourceCode = new SourceCode(this.options.path,this.options);
		/**
		 * 源代码检查
		 * 1.编码规范检查
		 * 2.兼容性css、html、js处理
		 * 3.翻译是否成功检查
		 * 4.源代码是否有中文检查
		 */
		sourceCode.test();
	});




}

module.exports = webpackReasyTestToolPlugin;