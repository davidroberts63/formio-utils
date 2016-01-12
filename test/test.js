/* eslint-env mocha */
var expect = require('chai').expect;

var utils = require('../src/index');

describe('eachComponent', function() {
	var components = require('./components.json');

	it('should iterate through nested components in the right order', function() {
		var n = 1;
		utils.eachComponent(components, function(component) {
			expect(component.order).to.equal(n);
			n += 1;
		});
	});
});
