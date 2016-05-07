# coconut.js

Coconut.JS is a javascript MVVM framework insired by Vue.JS and Angular.js. You might wonder why do i need another MVVM framework when there already MVVM frameworks are available out there. So the reason why Coconut.JS came out is because most of those frameworks restrict the developer to follow their syntaxes and guidlines to write applications. Coconut.JS allows the javascript developer to use Vanilla Javascript to write MVVM applications. 


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

```javascript
pol-bind
```


#### pol-click

binds a click event to an element

```javascript
pol-click
```



#### pol-repeat

binds an array of elements to the DOM

```javascript
pol-repeat
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





