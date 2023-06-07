'use strict';

import {expect} from 'chai';

import * as ActionAsWatcherInterface from '../../src/interfaces/action.as.watcher.interface';

describe('action.as.watcher.interface tests', () => {
	it('ActionAsWatcherInterface exists', () => {
		expect(ActionAsWatcherInterface).to.exist;
		expect(ActionAsWatcherInterface).to.be.an('object');
	});
});
