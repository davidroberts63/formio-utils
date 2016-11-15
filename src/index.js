'use strict';
var boolean = {
  'true': true,
  'false': false
};
module.exports = {
  /**
   * Determine if a component is a layout component or not.
   *
   * @param {Object} component
   *   The component to check.
   *
   * @returns {Boolean}
   *   Whether or not the component is a layout component.
   */
  isLayoutComponent: function isLayoutComponent(component) {
    return (
      (component.columns && Array.isArray(component.columns)) ||
      (component.rows && Array.isArray(component.rows)) ||
      (component.components && Array.isArray(component.components))
    ) ? true : false;
  },

  /**
   * Iterate through each component within a form.
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {Function} fn
   *   The iteration function to invoke for each component.
   * @param {Boolean} includeAll
   *   Whether or not to include layout components.
   * @param {String} path
   *   The current data path of the element. Example: data.user.firstName
   */
  eachComponent: function eachComponent(components, fn, includeAll, path) {
    if (!components) return;
    path = path || '';
    components.forEach(function(component) {
      var hasColumns = component.columns && Array.isArray(component.columns);
      var hasRows = component.rows && Array.isArray(component.rows);
      var hasComps = component.components && Array.isArray(component.components);
      var noRecurse = false;
      var newPath = component.key ? (path ? (path + '.' + component.key) : component.key) : '';

      if (includeAll || component.tree || (!hasColumns && !hasRows && !hasComps)) {
        noRecurse = fn(component, newPath);
      }

      var subPath = function() {
        if (component.key && ((component.type === 'datagrid') || (component.type === 'container'))) {
          return newPath;
        }
        return path;
      };

      if (!noRecurse) {
        if (hasColumns) {
          component.columns.forEach(function(column) {
            eachComponent(column.components, fn, includeAll, subPath());
          });
        }

        else if (hasRows) {
          [].concat.apply([], component.rows).forEach(function(row) {
            eachComponent(row.components, fn, includeAll, subPath());
          });
        }

        else if (hasComps) {
          eachComponent(component.components, fn, includeAll, subPath());
        }
      }
    });
  },

  /**
   * Get a component by its key
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {String} key
   *   The key of the component to get.
   *
   * @returns {Object}
   *   The component that matches the given key, or undefined if not found.
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
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {Boolean} includeAll
   *   Whether or not to include layout components.
   *
   * @returns {Object}
   *   The flattened components map.
   */
  flattenComponents: function flattenComponents(components, includeAll) {
    var flattened = {};
    module.exports.eachComponent(components, function(component, path) {
      flattened[path] = component;
    }, includeAll);
    return flattened;
  },

  /**
   * Checks the conditions for a provided component and data.
   *
   * @param component
   * @param submission
   * @param data
   * @returns {boolean}
   */
  checkCondition: function(component, submission, data) {
    var shown = true;
    var subData = submission ? submission.data : {};
    var compData = Object.assign({}, subData, data);
    if (component.customConditional) {
      try {
        shown = eval('(function() { ' + component.customConditional.toString() + '; return show; })()');
        shown = boolean.hasOwnProperty(shown.toString()) ? boolean[shown] : true;
      }
      catch (e) {
        console.warn('An error occurred in a custom conditional statement for component ' + component.key, e);
        shown = true;
      }
    }
    else if (component.conditional && component.conditional.when) {
      var cond = component.conditional;
      var value = this.getValue({data: compData}, cond.when);
      if (typeof value !== 'undefined' && typeof value !== 'object') {
        // Check if the conditional value is equal to the trigger value
        shown = (value.toString() === cond.eq.toString()) ? boolean[cond.show] : !boolean[cond.show];
      }
      // Special check for check boxes component.
      else if (typeof value !== 'undefined' && typeof value === 'object') {
        // Only update the visibility is present, otherwise hide, because it was deleted by the submission sweep.
        if (value.hasOwnProperty(cond.eq)) {
          shown = boolean.hasOwnProperty(value[cond.eq]) ? boolean[value[cond.eq]] : true;
        }
        else {
          shown = false;
        }
      }
      // Check against the components default value, if present and the components hasn't been interacted with.
      else if (typeof value === 'undefined' && cond.hasOwnProperty('defaultValue')) {
        shown = (cond.defaultValue.toString() === cond.eq.toString()) ? boolean[cond.show] : !boolean[cond.show];
      }
      // If there is no value, we still need to process as not equal.
      else {
        shown = !boolean[cond.show];
      }
    }

    // Return if this is component is shown.
    return shown;
  },

  /**
   * Get the value for a component key, in the given submission.
   *
   * @param {Object} submission
   *   A submission object to search.
   * @param {String} key
   *   A for components API key to search for.
   */
  getValue: function getValue(submission, key) {
    var data = submission.data || {};

    var search = function search(data) {
      var i;
      var value;

      if (!data) {
        return null;
      }

      if (data instanceof Array) {
        for (i = 0; i < data.length; i++) {
          if (typeof data[i] === 'object') {
            value = search(data[i]);
          }

          if (value) {
            return value;
          }
        }
      }
      else if (typeof data === 'object') {
        if (data.hasOwnProperty(key)) {
          return data[key];
        }

        var keys = Object.keys(data);
        for (i = 0; i < keys.length; i++) {
          if (typeof data[keys[i]] === 'object') {
            value = search(data[keys[i]]);
          }

          if (value) {
            return value;
          }
        }
      }
    };

    return search(data);
  }
};
