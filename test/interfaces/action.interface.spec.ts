'use strict';

import {expect} from 'chai';

import * as ActionInterface from '../../src/interfaces/action.interface';
import ActionInterfaceType from '../../src/interfaces/action.interface';

// Mock implementation for testing
class MockAction implements ActionInterfaceType {
	description(): string {
		return 'Mock action description';
	}

	async handle(...args: any[]): Promise<any> {
		return Promise.resolve(args);
	}
}

describe('action.interface tests', () => {
	it('ActionInterface exists', () => {
		expect(ActionInterface).to.exist;
		expect(ActionInterface).to.be.an('object');
	});

	it('ActionInterface can be implemented by a class', () => {
		const mockAction = new MockAction();
		expect(mockAction).to.exist;
		expect(mockAction.description).to.be.a('function');
		expect(mockAction.handle).to.be.a('function');
	});

	it('ActionInterface implementation has correct method signatures', () => {
		const mockAction = new MockAction();

		// Test description method
		expect(mockAction.description()).to.be.a('string');
		expect(mockAction.description()).to.equal('Mock action description');

		// Test handle method
		expect(mockAction.handle()).to.be.a('promise');
	});

	it('ActionInterface handle method can accept multiple arguments', async () => {
		const mockAction = new MockAction();
		const result = await mockAction.handle('arg1', 'arg2', 'arg3');
		expect(result).to.deep.equal(['arg1', 'arg2', 'arg3']);
	});

	it('ActionInterface handle method returns a Promise', async () => {
		const mockAction = new MockAction();
		const result = mockAction.handle();
		expect(result).to.be.a('promise');

		const resolvedResult = await result;
		expect(resolvedResult).to.exist;
	});

	it('ActionInterface description method returns string', () => {
		const mockAction = new MockAction();
		const description = mockAction.description();
		expect(description).to.be.a('string');
		expect(description.length).to.be.greaterThan(0);
	});
});
