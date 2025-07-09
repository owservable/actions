'use strict';

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
		expect(ActionInterface).toBeDefined();
		expect(typeof ActionInterface).toBe('object');
	});

	it('ActionInterface can be implemented by a class', () => {
		const mockAction = new MockAction();
		expect(mockAction).toBeDefined();
		expect(typeof mockAction.description).toBe('function');
		expect(typeof mockAction.handle).toBe('function');
	});

	it('ActionInterface implementation has correct method signatures', () => {
		const mockAction = new MockAction();

		// Test description method
		expect(typeof mockAction.description()).toBe('string');
		expect(mockAction.description()).toBe('Mock action description');

		// Test handle method
		expect(mockAction.handle()).toBeInstanceOf(Promise);
	});

	it('ActionInterface handle method can accept multiple arguments', async () => {
		const mockAction = new MockAction();
		const result = await mockAction.handle('arg1', 'arg2', 'arg3');
		expect(result).toEqual(['arg1', 'arg2', 'arg3']);
	});

	it('ActionInterface handle method returns a Promise', async () => {
		const mockAction = new MockAction();
		const result = mockAction.handle();
		expect(result).toBeInstanceOf(Promise);

		const resolvedResult = await result;
		expect(resolvedResult).toBeDefined();
	});

	it('ActionInterface description method returns string', () => {
		const mockAction = new MockAction();
		const description = mockAction.description();
		expect(typeof description).toBe('string');
		expect(description.length).toBeGreaterThan(0);
	});
});
