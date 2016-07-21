# Specla autoloader

```js
var Namespace = new Autoloader([
  'controllers',
  'models',
]).namespaced();

console.log(Namespace); // will return namespaced object with exports
```

```js
// load modules globally
new Autoloader([
  'controllers',
  'models',
]).global();
```
