module.exports = {
	eachComponent: function eachComponent(components, fn) {
		if (!components) return;

		components.forEach(function(component) {
			if (component.columns) {
				component.columns.forEach(function(column) {
					eachComponent(column.components, fn);
				});
			}

			else if (component.rows) {
				[].concat.apply([], component.rows).forEach(function(row) {
					eachComponent(row.components, fn);
				});
			}

			else if (component.components) {
				eachComponent(component.components, fn);
			}

			else {
				fn(component);
			}
		});
	}
};
