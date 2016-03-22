module.exports = {
  /**
   * Iterate through each component within a form.
   * @param components
   * @param fn
   */
  eachComponent: function eachComponent(components, fn, showLayouts) {
    if (!components) return;

    components.forEach(function(component) {
      var layout = false;
      if (component.columns && Array.isArray(component.columns)) {
        layout = true;
        component.columns.forEach(function(column) {
          eachComponent(column.components, fn);
        });
      }

      else if (component.rows && Array.isArray(component.rows)) {
        layout = true;
        [].concat.apply([], component.rows).forEach(function(row) {
          eachComponent(row.components, fn);
        });
      }

      else if (component.components && Array.isArray(component.components)) {
        layout = true;
        eachComponent(component.components, fn);
      }

      else {
        fn(component);
      }
      // If the component is a tree or we want to show layouts, be sure to add it back in as well.
      if (layout && (component.tree || showLayouts)) {
        fn(component);
      }
    });
  },

  /**
   * Get a component by its key
   * @param components
   * @param key The key of the component to get
   * @returns The component that matches the given key, or undefined if not found.
   */
  getComponent: function getComponent(components, key) {
    var result;
    module.exports.eachComponent(components, function(component) {
      if (component.key === key) {
        result = component;
      }
    });
    return result;
  },

  /**
   * Flatten the form components for data manipulation.
   * @param components
   * @param flattened
   * @returns {*|{}}
   */
  flattenComponents: function flattenComponents(components) {
    var flattened = {};
    module.exports.eachComponent(components, function(component) {
      flattened[component.key] = component;
    });
    return flattened;
  }
};
