'use strict';

import {expect} from 'chai';

import * as ActionInterface from '../../src/interfaces/action.interface';

describe('action.interface tests', () => {
	it('ActionInterface exists', () => {
		expect(ActionInterface).to.exist;
		expect(ActionInterface).to.be.an('object');
	});
});
