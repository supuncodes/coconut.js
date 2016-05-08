(function (){

	var PlantBag = (function(){
		
		function register(){

		}

		return {
			register:register
		}
	})();

	var SeedBag = (function(){

		var allSeeds = {};
		var seedList = [];

		function get(seed){
			if (allSeeds[seed])
				return allSeeds[seed];
		}

		function register(seed, data){
			allSeeds[seed] = data;
			seedList.push(seed);
		}

		function registerDefaultSeeds(){

			register("pol-repeat", function(el,value, path, watchObj, dec, DOMManager){
					
					var templateText = ""; //get the inner html text first
					templateText = "<div><b>HELLO!!!</b></div>";
					
					var newNode = el.cloneNode(true);
					newNode.innerHTML = templateText;
					el.parentElement.insertBefore(newNode,el);


					//el.parentElement.removeChild(newNode,el);
					//el.outerHtml = "asd";
				}
			);


			register("pol-click", function(el,value, path, watchObj, dec, DOMManager){
					el.addEventListener("click", function(){
						dec[value]();
					});
				}
			);

			register("pol-model", function(el,value, path, watchObj, dec, DOMManager){
					el.addEventListener("input", function(arg){
						DOMManager.update("scope." + value,arg.target.value, el);
					});
				}
			);

			register("pol-bind", function(el,value, path, watchObj, dec, DOMManager){
					if (el.tagName === "INPUT"){
						el.addEventListener("input", function(arg){
							DOMManager.update(path + "." + value,arg.target.value, el);
						});

						var propPath = path + "." + value;
						watchObj.watch(propPath, el, "value");

						var currentVal = eval(propPath.replace("scope", "dec"));
						if (currentVal)
							el.value = currentVal;
					}else{
						if (value.trim() === ""){
							var str = el.innerHTML;
							if (str)
							if (str.includes("{{") && str.includes("}}")){
								var propName = str.substring(str.indexOf("{{") +2, str.indexOf("}}"));
								var propPath = path + "." + propName;
								watchObj.watch(propPath, el, "@@INNER", str);

								var currentVal = eval(propPath.replace("scope", "dec"));
								if (currentVal)
									el.innerHTML = str.replace("{{" + propName +"}}", currentVal);
							}
						}
					}
				}
			);
		}

		registerDefaultSeeds();

		return {
			get: get,
			register: register,
			getSupported: function(){return seedList;}
		}
	})();


	var DOMManager = (function (){
		var elementwatchers = {};

		return {
			watch: function(path, element, property, template){
				if (!elementwatchers[path])
					elementwatchers[path] = [];

				elementwatchers[path].push({
					element:element,
					property: property,
					template: template
				});
			},
			traverse: function(path, e,dec){
				if (!dec)
					dec = {};

				var elementQueue = [document.getElementById(e)];
				var supportedSeeds = SeedBag.getSupported();

				while (elementQueue.length != 0){
					var ce = elementQueue[0];
					for(cei in ce.children) 
						elementQueue.push(ce.children[cei]);
					elementQueue.splice(0,1);
					
					for (ai in ce.attributes){
						var attrib = ce.attributes[ai]
						
						if (supportedSeeds.indexOf(attrib.name) != -1){
							var seedClass = SeedBag.get(attrib.name);
							var seedObj = new seedClass(ce,attrib.value, path, this,dec,DOMManager);
						}
					}
				}

				return dec;
			},
			update: function(p,v,e){
				var elements = elementwatchers[p];
				if (elements){
					for(ei in elements)
						if (elements[ei].element !== e){
							if (elements[ei].property == "@@INNER")
								if (elements[ei].template)
									elements[ei].element.innerHTML = elements[ei].template.replace("{{"+ p.replace("scope.","") +"}}", v);
								else
									elements[ei].element.innerHTML = v;
							else{
								if (elements[ei].element.tagName === "INPUT")
									elements[ei].element.value = v;
								else
									elements[ei].element.setAttribute(elements[ei].property, v);
							}
								
								
						}
				}
			}
		}
	})()

	function WatchableObject(d, decObj, el){
		var isInitializing = true;
		function WatchableProperty(obj, prop, path){
			Object.defineProperty(obj, prop, {set: function (newval) {
				if (!isInitializing){
					DOMManager.update(path,newval);
				}
			}});
		}

		function getWatchableArray(d, arrObj){
			arrObj.init = function(){
				for(ai in arrObj){
					var watchEl;
					if (typeof arrObj[ai] === "object"){
						
						if (arrObj[ai] instanceof Array)
							watchEl = getWatchableArray(d + "[" + ai + "]", arrObj[ai]);
						else
							watchEl = new WatchableObject(d + "[" + ai + "]", arrObj[ai]);

						watchEl.init();

					}else if (typeof arrObj[ai] === "function"){

					}else {
						//watchEl = new WatchableProperty(this, p, d + "." + p);
					}

					arrObj[ai] = watchEl;
				}

			}

			arrObj.oldPush = arrObj.push;
			arrObj.oldSplice = arrObj.splice;

			arrObj.push = function(){
				arrObj.oldPush();
			}

			arrObj.splice = function(){
				arrObj.oldSplice();
			}

			return arrObj;
		}

		var propUnits = {};

		var deceratorObj = {
			init: function(){

				if (decObj)
					for (v in decObj)
						this[v] = decObj[v];

				if (el)
					decObj = DOMManager.traverse(d, el, this);

				this.makeWatchable();
				isInitializing = false;
			},
			makeWatchableProp: function(p){
				if (typeof this[p] === "object"){
					var watchObj;
					if (this[p] instanceof Array)
						watchObj = getWatchableArray(d + "." + p, this[p]);
					else
						watchObj = new WatchableObject(d + "." + p, this[p]);
					
					watchObj.init();
					propUnits[p] = watchObj;
					this[p] = watchObj;
				}else if (typeof this[p] === "function"){

				}else{
					var tmpVal = this[p];
					delete this[p];
					propUnits[p] = new WatchableProperty(this, p, d + "." + p);
					this[v] = tmpVal;
				}						
			},
			makeWatchable: function(){
				for (v in this)
					this.makeWatchableProp(v);
			},
			getAttributes: function(){ return decObj;},
			merge: function(obj){
				for (ok in obj)
					decObj[ok] = obj[ok];
			},
			toPlant: function(name){PlantBag.register(name, this);}
		};

		return deceratorObj;
	}

	var watchObjects = [];
	window.coconut = {
		shell: function(id, data){
			var att;
			if (data)
				if (data.state)
					att = data.state;

			if (!att) att = {};

			var watchObj = new WatchableObject("scope",att, id);
			watchObjects.push(watchObj);
			return watchObj;

		}, 
		init: function(){
			for(wi in watchObjects)
				watchObjects[wi].init();
		}
	}


	if (!String.prototype.includes) 
	String.prototype.includes = function(str, ignoreCase) {
	  return (ignoreCase ? this.toUpperCase() : this)
	    .indexOf(ignoreCase ? str.toUpperCase() : str) >= 0;
	};


	window.addEventListener("load", window.coconut.init);
})()