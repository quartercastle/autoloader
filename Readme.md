# Specla autoloader

```js
var Namespace = new Autoloader(__dirname).namespaced([
  'controllers',
  'models',
]);

console.log(Namespace); // will return namespaced object with exports
```

```js
// load modules globally
new Autoloader(__dirname).global([
  'controllers',
  'models',
]);
```

