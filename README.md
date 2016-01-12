# formio-utils
Utility functions for form.io

## Installing

```
$ npm install formio-utils
```

## Functions

### eachComponent(components, fn)

Calls `fn(component)` for each component in `components`, accounting for nested layout components. (Does not call for layout components themselves).

```javascript
var utils = require('formio-utils');

utils.eachComponent(form.components, function(component) {
	// Do something...
})
```

### getComponent(components, key)

Returns the component with the given `key` or undefined if not found.

```javascript
var utils = require('formio-utils');

var component = utils.getComponent(form.components, 'myKey');
```

### flattenComponents(components)

Returns an key-value object where the keys are the keys for each component in `components` and each key points to the corresponding component. This includes nested components as well.

```javascript
var utils = require('formio-utils');

var flattened = utils.flattenComponents(form.components);
console.log(flattened['myNestedComponent']);
```

## Testing

```
$ npm run test
```