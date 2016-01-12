# formio-utils
Utility functions for form.io

## Installing
`npm install formio-utils`

## Functions

### eachComponent(components, fn)

Calls `fn(component)` for each component in `components`, accounting for nested layout components. (Does not call for layout components themselves).