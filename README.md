# formio-utils
Utility functions for form.io

## Installing

```
$ npm install formio-utils
```

## Functions

### eachComponent(components, fn)

Calls `fn(component)` for each component in `components`, accounting for nested layout components. (Does not call for layout components themselves).

```
var utils = require('formio-utils');

utils.eachComponent(form.components, function(component) {
	// Do something...
})
```


## Building

```
$ npm run build
```

## Testing

```
$ npm run test
```