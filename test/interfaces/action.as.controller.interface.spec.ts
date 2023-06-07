'use strict';

import {expect} from 'chai';

import * as ActionAsControllerInterface from '../../src/interfaces/action.as.controller.interface';

describe('action.as.controller.interface tests', () => {
	it('ActionAsControllerInterface exists', () => {
		expect(ActionAsControllerInterface).to.exist;
		expect(ActionAsControllerInterface).to.be.an('object');
	});
});
