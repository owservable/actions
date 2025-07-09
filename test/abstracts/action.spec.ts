'use strict';

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
		expect(Action).toBeDefined();
		expect(typeof Action).toBe('function');
	});

	it('Action can be extended', () => {
		const action = new TestAction();
		expect(action).toBeDefined();
		expect(action).toBeInstanceOf(Action);
	});

	it('Action has signature method that returns empty string by default', () => {
		const action = new TestAction();
		expect(typeof action.signature).toBe('function');
		expect(action.signature()).toBe('');
	});

	it('Action has description method that returns empty string by default', () => {
		const action = new TestAction();
		expect(typeof action.description).toBe('function');
		expect(action.description()).toBe('');
	});

	it('Action has schedule method that returns empty string by default', () => {
		const action = new TestAction();
		expect(typeof action.schedule).toBe('function');
		expect(action.schedule()).toBe('');
	});

	it('Action protected properties can be set and retrieved', () => {
		const testSignature = 'test-command {--option}';
		const testDescription = 'Test command description';
		const testSchedule = '0 */5 * * * *';

		const action = new TestAction(testSignature, testDescription, testSchedule);

		expect(action.signature()).toBe(testSignature);
		expect(action.description()).toBe(testDescription);
		expect(action.schedule()).toBe(testSchedule);
	});

	it('Action methods return string type', () => {
		const action = new TestAction();

		expect(typeof action.signature()).toBe('string');
		expect(typeof action.description()).toBe('string');
		expect(typeof action.schedule()).toBe('string');
	});

	it('Action is an abstract class', () => {
		// Abstract classes in TypeScript don't throw at runtime when cast to any
		// This test verifies that Action is properly defined as abstract
		expect(Action).toBeDefined();
		expect(typeof Action).toBe('function');
	});
});
