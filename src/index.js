export let eachComponent = function(components, fn) {
	if (!components) return;

	components.forEach((component) => {
		if (component.columns) {
			component.columns.forEach((column) => eachComponent(column.components, fn));
		}

		else if (component.rows) {
			[].concat(...component.rows).forEach((row) => eachComponent(row.components, fn));
		}

		else if (component.components) {
			eachComponent(component.components, fn);
		}

		else {
			fn(component);
		}
	});
};
