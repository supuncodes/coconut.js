(function(){

	var components = [];

	function Component (e,h){

		var el;
		var watchers ={};

		function Watcher(el,p,t){

			return {
				element: el,
				property: p,
				template: t
			}
		}

		function valueChanged(target,k,v){
			scope.k = v;

			var elements = watchers[k];

			for(var i=0;i<elements.length;i++)
				if (elements[i] != target){
					if (elements[i].template){
						if (elements[i].property == "@@innerHTML")
							elements[i].element.innerHTML = elements[i].template.replace("{{" + k +"}}", v);
						else
							elements[i].element.setAttribute(elements[i].property, elements[i].template.replace("{{" + k +"}}", v));
					}
					else
						elements[i].element.setAttribute(elements[i].property, v);
				}
		}

		function init(){

			if (e[0] == "#") 
				el = document.getElementById(e.substring(1));			
			if (h) el.innerHTML = h;

			var allInputs = el.querySelectorAll('input[s-model]');
			
 			for (var i = 0; i < allInputs.length; i++){
 				allInputs[i].addEventListener("input", function(x){
 					valueChanged(x.target, x.target.getAttribute("s-model"),x.target.value)
 				}, false);

 				var watcher =  new Watcher(allInputs[i], "value");
 				var objKey = allInputs[i].getAttribute("s-model");

 				if (!watchers[objKey])
 					watchers[objKey] = [];

 				watchers[objKey].push(watcher);
 			}

			var allInputs = el.querySelectorAll('[s-bind]');
			console.log(allInputs);

 			for (var i = 0; i < allInputs.length; i++){
 				var innerHTML = allInputs[i].innerHTML;
 				if (innerHTML.contains("{{") && innerHTML.contains("}}")){
 					
 					var watcher =  new Watcher(allInputs[i], "@@innerHTML", innerHTML);
 					var objKey = innerHTML.substring(innerHTML.indexOf("{{") +2, innerHTML.indexOf("}}"));

	 				if (!watchers[objKey])
	 					watchers[objKey] = [];

	 				console.log(watcher);

	 				watchers[objKey].push(watcher);	
 				}
 			}

 			//get all elements that have {{}}

			var allInputs = el.querySelectorAll('[s-click]');
 			for (var i = 0; i < allInputs.length; i++){
 				allInputs[i].addEventListener("click", function(x){
 					var objKey = x.target.getAttribute("s-click");
 					scope[objKey]();
 				}, false);
 			}

 			for (si in scope)
 				if (!(typeof scope[si] === "function" ||typeof scope[si] === "object"))
	 			{
	 				valueChanged (undefined, si, scope[si]);
	 			}
		}

		var scope = {
			init: init
		};

		return scope;
	}

	function create(e,h){
		var nc = new Component(e,h);
		components.push(nc);
		return nc;
	}

	window.Coconut = {
		shell:create,
		init: function(){for(ci in components) components[ci].init();}
	}
	
	window.addEventListener("load", window.Coconut.init);
})()