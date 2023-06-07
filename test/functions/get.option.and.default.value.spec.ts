'use strict';

import {expect} from 'chai';

import getOptionAndDefaultValue from '../../src/functions/get.option.and.default.value';

describe('get.option.and.default.value tests', () => {
	it('findCommandAction exists', () => {
		expect(getOptionAndDefaultValue).to.exist;
		expect(getOptionAndDefaultValue).to.be.a('function');
	});

	it('should be implemented');
});
