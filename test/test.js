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

	it('should include layouts components if provided', function() {
		var numComps = 0;
		var numLayout = 0;
		utils.eachComponent(components, function(component) {
			if (utils.isLayoutComponent(component)) {
				numLayout++;
			}
			else {
				numComps++;
			}
		}, true);
		expect(numLayout).to.be.equal(3);
		expect(numComps).to.be.equal(8);
	});

	it('should be able to block recursion', function() {
		var numComps = 0;
		var numLayout = 0;
		utils.eachComponent(components, function(component) {
			if (utils.isLayoutComponent(component)) {
				numLayout++;
			}
			else {
				numComps++;
			}

			if (component.type === 'table') {
				var numInTable = 0;
				[].concat.apply([], component.rows).forEach(function(row) {
					utils.eachComponent(row.components, function() {
						numInTable++;
					});
				});
				expect(numInTable).to.be.equal(4);
				return true;
			}
		}, true);
		expect(numLayout).to.be.equal(3);
		expect(numComps).to.be.equal(4);
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

	it('should work with a different this context', function() {
		for (var n = 1; n <= 8; n += 1) {
			var component = utils.getComponent.call({}, components, writtenNumber(n));
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

	it('should work with a different this context', function() {
		var flattened = utils.flattenComponents.call({}, components);
		for (var n = 1; n <= 8; n += 1) {
			var component = flattened[writtenNumber(n)];
			expect(component).not.to.be.undefined;
			expect(component).to.be.an('object');
			expect(component.order).to.equal(n);
			expect(component.key).to.equal(writtenNumber(n));
		}
	});
});
