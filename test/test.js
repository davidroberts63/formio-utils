/* eslint-env mocha */
var expect = require('chai').expect;
var writtenNumber = require('written-number');

var utils = require('../src/index');

var components = require('./components.json');

describe('eachComponent', function() {
	it('should iterate through nested components in the right order', function() {
		var n = 1;
		utils.eachComponent(components, function(component) {
			expect(component.order).to.equal(n);
			n += 1;
		});
	});
});

describe('getComponent', function() {
	it('should return the correct components', function() {
		for (var n = 1; n <= 8; n += 1) {
			var component = utils.getComponent(components, writtenNumber(n));
			expect(component).not.to.be.null;
			expect(component).not.to.be.undefined;
			expect(component).to.be.an('object');
			expect(component.order).to.equal(n);
			expect(component.key).to.equal(writtenNumber(n));
		}
	});
});

describe('flattenComponents', function() {
	it('should return an object of flattened components', function() {
		var flattened = utils.flattenComponents(components);
		for (var n = 1; n <= 8; n += 1) {
			var component = flattened[writtenNumber(n)];
			expect(component).not.to.be.undefined;
			expect(component).to.be.an('object');
			expect(component.order).to.equal(n);
			expect(component.key).to.equal(writtenNumber(n));
		}
	});
});
