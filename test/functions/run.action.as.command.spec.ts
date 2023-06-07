'use strict';

import {expect} from 'chai';

import runActionAsCommand from '../../src/functions/run.action.as.command';

describe('run.action.as.command tests', () => {
	it('runActionAsCommand exists', () => {
		expect(runActionAsCommand).to.exist;
		expect(runActionAsCommand).to.be.a('function');
	});

	it('should be implemented');
});
