(function (){

	function WatchableObject(d, decObj, el){

		var DOMManager = (function (){
			var elementwatchers = {};

			function WatchableInput(path,element){
				element.addEventListener("input", function(arg){
					DOMManager.update(path,arg.target.value, element);
				});
			}

			function ClickableInput(element, func){
				element.addEventListener("click", function(){
					func();
				});
			}

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

					while (elementQueue.length != 0){
						var ce = elementQueue[0];
						for(cei in ce.children) 
							elementQueue.push(ce.children[cei]);
						elementQueue.splice(0,1);
						
						for (ai in ce.attributes){
							var attrib = ce.attributes[ai]

							if (attrib.name === "pol-bind"){
								if (ce.tagName === "INPUT"){
									new WatchableInput(path + "." + attrib.value, ce);
									var propPath = path + "." + attrib.value;
									this.watch(propPath, ce, "value");

									var currentVal = eval(propPath.replace("scope", "dec"));
									if (currentVal)
										ce.value = currentVal;
								}else{
									if (attrib.value.trim() === ""){
										var str = ce.innerHTML;
										if (str)
										if (str.contains("{{") && str.contains("}}")){
											var propName = str.substring(str.indexOf("{{") +2, str.indexOf("}}"));
											var propPath = path + "." + propName;
											this.watch(propPath, ce, "@@INNER", str);

											var currentVal = eval(propPath.replace("scope", "dec"));
											if (currentVal)
												ce.innerHTML = str.replace("{{" + propName +"}}", currentVal);
										}
									}
								}
							}else if (attrib.name === "pol-click"){
								var str = attrib.value;
								new ClickableInput(ce, dec[str]);
							}else{
								var str = attrib.value;
								if (str)
								if (str.contains("{{") && str.contains("}}")){
									var propName = str.substring(str.indexOf("{{") + 2, str.indexOf("}}"));
									var propPath = path + "." + propName;
									this.watch(propPath, ce, attrib.name, str);
								}
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

		var isInitializing = true;
		function WatchableProperty(obj, prop, path){
			Object.defineProperty(obj, prop, {set: function (newval) {
				if (!isInitializing){
					console.log("property changed : " + path);
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
			return arrObj;
		}

		var propUnits = {};

		var fakeObj = {
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
			getAttributes: function(){ return decObj;}
		};

		return fakeObj;
	}

	var watchObjects = [];
	window.coconut = {
		shell: function(d){
			var attribs = {};
			var watchObj = new WatchableObject("scope",attribs, d);
			watchObjects.push(watchObj);
			return watchObj;
		}, 
		init: function(){
			for(wi in watchObjects)
				watchObjects[wi].init();
		}
	}

	window.addEventListener("load", window.coconut.init);
})()