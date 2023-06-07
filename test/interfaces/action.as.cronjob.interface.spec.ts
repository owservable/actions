'use strict';

import {expect} from 'chai';

import * as ActionAsCronjobInterface from '../../src/interfaces/action.as.cronjob.interface';

describe('action.as.cronjob.interface tests', () => {
	it('ActionAsCronjobInterface exists', () => {
		expect(ActionAsCronjobInterface).to.exist;
		expect(ActionAsCronjobInterface).to.be.an('object');
	});
});
