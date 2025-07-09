'use strict';

import {expect} from 'chai';

import Action from '../../src/abstracts/action';

// Create a concrete implementation for testing
class TestAction extends Action {
	constructor(signature?: string, description?: string, schedule?: string) {
		super();
		if (signature) this._signature = signature;
		if (description) this._description = description;
		if (schedule) this._schedule = schedule;
	}
}

describe('action tests', () => {
	it('Action exists and is a function', () => {
		expect(Action).to.exist;
		expect(Action).to.be.a('function');
	});

	it('Action can be extended', () => {
		const action = new TestAction();
		expect(action).to.exist;
		expect(action).to.be.an.instanceof(Action);
	});

	it('Action has signature method that returns empty string by default', () => {
		const action = new TestAction();
		expect(action.signature).to.be.a('function');
		expect(action.signature()).to.equal('');
	});

	it('Action has description method that returns empty string by default', () => {
		const action = new TestAction();
		expect(action.description).to.be.a('function');
		expect(action.description()).to.equal('');
	});

	it('Action has schedule method that returns empty string by default', () => {
		const action = new TestAction();
		expect(action.schedule).to.be.a('function');
		expect(action.schedule()).to.equal('');
	});

	it('Action protected properties can be set and retrieved', () => {
		const testSignature = 'test-command {--option}';
		const testDescription = 'Test command description';
		const testSchedule = '0 */5 * * * *';

		const action = new TestAction(testSignature, testDescription, testSchedule);

		expect(action.signature()).to.equal(testSignature);
		expect(action.description()).to.equal(testDescription);
		expect(action.schedule()).to.equal(testSchedule);
	});

	it('Action methods return string type', () => {
		const action = new TestAction();

		expect(action.signature()).to.be.a('string');
		expect(action.description()).to.be.a('string');
		expect(action.schedule()).to.be.a('string');
	});

	it('Action cannot be instantiated directly', () => {
		expect(() => new (Action as any)()).to.throw();
	});
});
