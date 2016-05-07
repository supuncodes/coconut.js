# coconut.js

Coconut.JS is a javascript MVVM framework insired by Vue.JS and Angular.js. The main advantage of using coconut.js is its simplicity complared to other frameworks. Angular.JS and Vue.JS are amazing frameworks that are stable wnd widely used. However those frameworks restrict the developer to follow their syntaxes and guidlines to write applications. Coconut.js addresses that issue by providing a framework for the developer to use vanilla javaScript to write MVVM applications.

please note that Coconut.JS is still in its infant stages so we do not recommend it for commercial applications at this point. Still you are welcome to contribute by developing and testing.


# Installing

You can install coconut.js using the following methods;

using bower

```shell
bower install coconut.js
```

or using npm

```shell
npm install https://github.com/supuncodes/coconut.js
```


# coconut.js hello world


Its so simple that tou only need to follow these steps.

* first, create the view inside your html (in this example the view is the div tag idMain) and add the necessary seeds in it (seeds are similar to angular.js directives)
* then map the view into the coconut shell (similar to angular.js controller)
 

```html
<html>
	<head>
		<script type="text/javascript" src="coconut.js"></script>
		<script type="text/javascript">		
        	var scope = coconut.shell("idMain");
		</script>
	</head>
	<body>
		<div id="idMain">
			<p pol-bind>Hello : {{name}}</p>	
			<input pol-bind="name" type="text"/>
		</div>
	</body>
</html>
```

# Seeds in coconut.js


### seeds available in the aplha version

A seed is similar to an angular.js directive. currently in the alpha version only the following seeds are supported.

#### pol-bind

binds data to a particular element.

```html
<p pol-bind>Hello : {{name}}</p>	
```


#### pol-click

binds a click event to an element

```javascript
var shell = coconut.shell("idMain", {state:data});
shell.submit = function(){
	alert ("submitted");
};
```


```html
<button pol-click="submit">Submit</button>
```



#### pol-repeat

binds an array of elements to the DOM

```javascript
var shell = coconut.shell("idMain", {state:data});
shell.testArray: [{id:1, name:"Supun"},{id:2, name:"Supun 2"}]
```


```html
<p pol-repeat="a in testArray"><div>{{a.name}}</div></p>
```



### Writing your own seeds

if you need a specific functionality you can develop your own seeds using the following method

```javascript
coconut.newseed("my-click", function(el){
		el.addEventListener("click", function(){
			alert ("my click event triggerd!!!");
		});
	}
);
```



# Licencing

coconut.js is released under [LGPL](http://www.gnu.org/licenses/lgpl-3.0.en.html) licence.
