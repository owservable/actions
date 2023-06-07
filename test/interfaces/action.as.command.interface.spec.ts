'use strict';

import {expect} from 'chai';

import * as ActionAsCommandInterface from '../../src/interfaces/action.as.command.interface';

describe('action.as.command.interface tests', () => {
	it('ActionAsCommandInterface exists', () => {
		expect(ActionAsCommandInterface).to.exist;
		expect(ActionAsCommandInterface).to.be.an('object');
	});
});
