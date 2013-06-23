/**
 * @overview Definition of jsOOP Library, a Helper to facilitates OOP in
 * javascript
 *
 * @author Daniel Goberitz <dalgo86@gmail.com>
 * @version 0.1
 */

(function(){
	
function printStackTrace(a){var a=a||{guess:!0},b=a.e||null,a=!!a.guess,d=new printStackTrace.implementation,b=d.run(b);return a?d.guessAnonymousFunctions(b):b}printStackTrace.implementation=function(){};
printStackTrace.implementation.prototype={run:function(a,b){a=a||this.createException();b=b||this.mode(a);return"other"===b?this.other(arguments.callee):this[b](a)},createException:function(){try{this.undef()}catch(a){return a}},mode:function(a){return a.arguments&&a.stack?"chrome":a.stack&&a.sourceURL?"safari":"string"===typeof a.message&&"undefined"!==typeof window&&window.opera?!a.stacktrace||-1<a.message.indexOf("\n")&&a.message.split("\n").length>a.stacktrace.split("\n").length?"opera9":!a.stack?
"opera10a":0>a.stacktrace.indexOf("called from line")?"opera10b":"opera11":a.stack?"firefox":"other"},instrumentFunction:function(a,b,d){var a=a||window,c=a[b];a[b]=function(){d.call(this,printStackTrace().slice(4));return a[b]._instrumented.apply(this,arguments)};a[b]._instrumented=c},deinstrumentFunction:function(a,b){a[b].constructor===Function&&(a[b]._instrumented&&a[b]._instrumented.constructor===Function)&&(a[b]=a[b]._instrumented)},chrome:function(a){a=(a.stack+"\n").replace(/^\S[^\(]+?[\n$]/gm,
"").replace(/^\s+(at eval )?at\s+/gm,"").replace(/^([^\(]+?)([\n$])/gm,"{anonymous}()@$1$2").replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm,"{anonymous}()@$1").split("\n");a.pop();return a},safari:function(a){return a.stack.replace(/\[native code\]\n/m,"").replace(/^@/gm,"{anonymous}()@").split("\n")},firefox:function(a){return a.stack.replace(/(?:\n@:0)?\s+$/m,"").replace(/^[\(@]/gm,"{anonymous}()@").split("\n")},opera11:function(a){for(var b=/^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/,
a=a.stacktrace.split("\n"),d=[],c=0,f=a.length;c<f;c+=2){var e=b.exec(a[c]);if(e){var g=e[4]+":"+e[1]+":"+e[2],e=e[3]||"global code",e=e.replace(/<anonymous function: (\S+)>/,"$1").replace(/<anonymous function>/,"{anonymous}");d.push(e+"@"+g+" -- "+a[c+1].replace(/^\s+/,""))}}return d},opera10b:function(a){for(var b=/^(.*)@(.+):(\d+)$/,a=a.stacktrace.split("\n"),d=[],c=0,f=a.length;c<f;c++){var e=b.exec(a[c]);e&&d.push((e[1]?e[1]+"()":"global code")+"@"+e[2]+":"+e[3])}return d},opera10a:function(a){for(var b=
/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,a=a.stacktrace.split("\n"),d=[],c=0,f=a.length;c<f;c+=2){var e=b.exec(a[c]);e&&d.push((e[3]||"{anonymous}")+"()@"+e[2]+":"+e[1]+" -- "+a[c+1].replace(/^\s+/,""))}return d},opera9:function(a){for(var b=/Line (\d+).*script (?:in )?(\S+)/i,a=a.message.split("\n"),d=[],c=2,f=a.length;c<f;c+=2){var e=b.exec(a[c]);e&&d.push("{anonymous}()@"+e[2]+":"+e[1]+" -- "+a[c+1].replace(/^\s+/,""))}return d},other:function(a){for(var b=/function\s*([\w\-$]+)?\s*\(/i,
d=[],c,f;a&&a.arguments&&10>d.length;)c=b.test(a.toString())?RegExp.$1||"{anonymous}":"{anonymous}",f=Array.prototype.slice.call(a.arguments||[]),d[d.length]=c+"("+this.stringifyArguments(f)+")",a=a.caller;return d},stringifyArguments:function(a){for(var b=[],d=Array.prototype.slice,c=0;c<a.length;++c){var f=a[c];void 0===f?b[c]="undefined":null===f?b[c]="null":f.constructor&&(f.constructor===Array?b[c]=3>f.length?"["+this.stringifyArguments(f)+"]":"["+this.stringifyArguments(d.call(f,0,1))+"..."+
this.stringifyArguments(d.call(f,-1))+"]":f.constructor===Object?b[c]="#object":f.constructor===Function?b[c]="#function":f.constructor===String?b[c]='"'+f+'"':f.constructor===Number&&(b[c]=f))}return b.join(",")},sourceCache:{},ajax:function(a){var b=this.createXMLHTTPObject();if(b)try{return b.open("GET",a,!1),b.send(null),b.responseText}catch(d){}return""},createXMLHTTPObject:function(){for(var a,b=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},
function(){return new ActiveXObject("Microsoft.XMLHTTP")}],d=0;d<b.length;d++)try{return a=b[d](),this.createXMLHTTPObject=b[d],a}catch(c){}},isSameDomain:function(a){return"undefined"!==typeof location&&-1!==a.indexOf(location.hostname)},getSource:function(a){a in this.sourceCache||(this.sourceCache[a]=this.ajax(a).split("\n"));return this.sourceCache[a]},guessAnonymousFunctions:function(a){for(var b=0;b<a.length;++b){var d=/^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,c=a[b],f=/\{anonymous\}\(.*\)@(.*)/.exec(c);
if(f){var e=d.exec(f[1]);e&&(d=e[1],f=e[2],e=e[3]||0,d&&(this.isSameDomain(d)&&f)&&(d=this.guessAnonymousFunction(d,f,e),a[b]=c.replace("{anonymous}",d)))}}return a},guessAnonymousFunction:function(a,b){var d;try{d=this.findFunctionName(this.getSource(a),b)}catch(c){d="getSource failed with url: "+a+", exception: "+c.toString()}return d},findFunctionName:function(a,b){for(var d=/function\s+([^(]*?)\s*\(([^)]*)\)/,c=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/,f=/['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
e="",g,j=Math.min(b,20),h,i=0;i<j;++i)if(g=a[b-i-1],h=g.indexOf("//"),0<=h&&(g=g.substr(0,h)),g)if(e=g+e,(g=c.exec(e))&&g[1]||(g=d.exec(e))&&g[1]||(g=f.exec(e))&&g[1])return g[1];return"(?)"}};
	
	
	var BROWSER = 0x01,
	REQUIREJS = 0x02,
	NODEJS = 0x03,
	ENVIRONMENT
	;

	function isNodeJS(){
		return typeof require === "function" 
		&& module !== undefined && !!module.exports;
	}
	
	if(typeof define === "function" && !!define.amd){
		ENVIRONMENT = REQUIREJS;
	}else if(isNodeJS()){
		ENVIRONMENT = NODEJS;
	}else if(window !== undefined) {
		ENVIRONMENT = BROWSER;
	}

	var jsOOP = {
		/**
		 * Creates a class with the name given and the prototype, you must 
		 * specify another class to be the parent class.
		 * 
		 * @param {String} name A valid function name
		 * @param {Object} proto A key value object, with methods an properties 
		 *                       to be setted as a prototype.
		 * @param {Function} [superCtor] A Super Constructor to inherits
		 * 
		 * @return {Function};
		 */
		Class: function(name, proto, superCtor){
			var prop,
				klassCreator,
				EOL = '\n',
				code,
				ctor
			;

			code =
				'function ' + name + '(){' + EOL +
				'	this.__construct.apply(this, arguments);' + EOL +
				'};' + EOL + EOL +
				'return ' + name + ';' + EOL
			;
			klassCreator = new Function('p', 'i', code);
			ctor = klassCreator();

			if(superCtor){
				this.inherits(ctor, superCtor);
			}

			for(prop in proto){
				if(proto.hasOwnProperty(prop)){
					ctor.prototype[prop] = proto[prop];
				}
			}

			return ctor;
		},

		/**
		 * Extends ctor from superCtor;
		 * @example You can access to super methods using 
		 * ```ctor.super_.methodName.apply(this, arguments);```
		 * or
		 * 
		 *	function myClass(){};
		 *	jsOOP.inherits(myClass, EventEmmiter);
		 *	myClass.prototype.on(){ 
		 *		return myClass.super_.on.apply(this, arguments);
		 *	};
		 * 
		 * @param {Function} ctor A Constructor reference
		 * @param {Function} superCtor A Super Constructor to inherits
		 */
		inherits: function(ctor, superCtor){
			if(isNodeJS()){
				var util = require();
				this.inherits = util.inherits;
				util.inherits(ctor, superCtor);
			}else{
				ctor.super_ = superCtor;
				ctor.prototype = Object.create(superCtor.prototype, {
					constructor: {
						value: ctor,
						enumerable: false,
						writable: true,
						configurable: true
					}
				});
			}
		},
		
		/**
		 * Fix the prototype chain, when you use .prototype = {};
		 * because of that the prototype of your constructor is Object
		 * 
		 * @example An example to what you need this method:
		 * 
		 *	function myClass(){};
		 *	myClass.prototype = {... some code ...};
		 *	
		 *	function mySonClass(){};
		 *	jsOOP.inherits(mySonClass, myClass);
		 *	mySonClass.prototype = {... some code ...};
		 *	
		 *	var obj = new mySonClass();
		 *	
		 *	console.log(obj instanceof mySonClass); //  false
		 *	console.log(obj instanceof myClass); //  false
		 * 
		 * if you don't use this you can use the instanceof operator 
		 * correspondly
		 * 
		 * @param {Function} ctor A Constructor reference
		 */
		fixPrototype: function(ctor){
			var proto = ctor.prototype,
				prop,
				superCtor = ctor.super_ ? ctor.super_ : Object
			;

			this.inherits(ctor, superCtor);

			for(prop in proto){
				if(proto.hasOwnProperty(prop)){
					ctor.prototype[prop] = proto[prop];
				}
			}
		},
		
		filterArguments: function(types, args){
			var i, err = [], stack, cut;
			function getErrMsg(i, type){
				return 'Argument ' + i + ' must be ' + types[i].prototype.constructor.name;
			}
			for(i = 0; i < types.length; i++){
				if('string' !== typeof(types[i])){
					if(String === types[i]){
						if('string' !== typeof(args[i])){
							err.push( getErrMsg(i, types[i]) );
						}
					}else if(!(args[i] instanceof types[i])){
						err.push( getErrMsg(i, types[i]) );
					}
				} 
			}
			
			if(err.length > 0){
				stack = printStackTrace();
				for(i = 0; i < stack.length; i++){
					if(stack[i].indexOf('jsOOP.filterArguments')){
						cut = i;
					}
				}
				stack = stack.splice(cut-1);
				
				throw new TypeError(
					'Arguments type mismatch: \n\t' 
					+ err.join('\n\t') 
					+ '\nStack Trace:\n\t' +
					stack.join('\n\t')
				);
			}
		}
	};

	switch(ENVIRONMENT){
		case REQUIREJS:
			define(jsOOP);
			break;
		case NODEJS:
			module.exports = jsOOP;
			break;
		case BROWSER:
		default:
			window.jsOOP = jsOOP;		
	}
})();


