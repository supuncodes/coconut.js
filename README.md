# Coconut.JS

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
