/* eslint-env mocha, node */
import {expect} from 'chai';

import {eachComponent} from '../src/index';

describe('eachComponent', () => {
	let components = require('./components.json');

	it('should iterate through nested components in the right order', () => {
		var n = 1;
		eachComponent(components, (component) => {
			expect(component.order).to.equal(n);
			n += 1;
		});
	});
});
