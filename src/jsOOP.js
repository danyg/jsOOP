/**
 * @overview Definition of jsOOP Library, a Helper to facilitates OOP in
 * javascript
 *
 * @author Daniel Goberitz <dalgo86@gmail.com>
 * @version 0.1
 */

(function(){
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
			var proto = ctor.prototype;

			if(ctor.super_){
				this.inherits(ctor, ctor.super_);
			}

			ctor.prototype = Object.create(proto, {
				constructor: {
					value: ctor,
					enumerable: false,
					writable: true,
					configurable: true
				}
			});
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


