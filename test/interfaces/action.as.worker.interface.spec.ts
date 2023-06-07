'use strict';

import {expect} from 'chai';

import * as ActionAsWorkerInterface from '../../src/interfaces/action.as.worker.interface';

describe('action.as.worker.interface tests', () => {
	it('ActionAsWorkerInterface exists', () => {
		expect(ActionAsWorkerInterface).to.exist;
		expect(ActionAsWorkerInterface).to.be.an('object');
	});
});
