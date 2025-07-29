'use strict';

import * as ActionAsCommandInterface from '../../src/interfaces/action.as.command.interface';
import ActionAsCommandInterfaceType from '../../src/interfaces/action.as.command.interface';

// Mock implementation for testing
class MockCommandAction implements ActionAsCommandInterfaceType {
	signature(): string {
		return 'test-command {--option}';
	}

	description(): string {
		return 'Test command description';
	}

	async handle<T>(...args: T[]): Promise<T[]> {
		return Promise.resolve(args);
	}

	async asCommand(options: Record<string, unknown>): Promise<void> {
		// Mock implementation
		return Promise.resolve();
	}
}

describe('action.as.command.interface tests', () => {
	it('ActionAsCommandInterface exists', () => {
		expect(ActionAsCommandInterface).toBeDefined();
		expect(typeof ActionAsCommandInterface).toBe('object');
	});

	it('ActionAsCommandInterface can be implemented by a class', () => {
		const mockAction = new MockCommandAction();
		expect(mockAction).toBeDefined();
		expect(typeof mockAction.signature).toBe('function');
		expect(typeof mockAction.description).toBe('function');
		expect(typeof mockAction.handle).toBe('function');
		expect(typeof mockAction.asCommand).toBe('function');
	});

	it('ActionAsCommandInterface implementation has correct method signatures', () => {
		const mockAction = new MockCommandAction();

		// Test signature method
		expect(typeof mockAction.signature()).toBe('string');
		expect(mockAction.signature()).toBe('test-command {--option}');

		// Test description method
		expect(typeof mockAction.description()).toBe('string');
		expect(mockAction.description()).toBe('Test command description');

		// Test handle method
		expect(mockAction.handle()).toBeInstanceOf(Promise);

		// Test asCommand method
		expect(mockAction.asCommand({})).toBeInstanceOf(Promise);
	});

	it('ActionAsCommandInterface signature method returns string', () => {
		const mockAction = new MockCommandAction();
		const signature = mockAction.signature();
		expect(typeof signature).toBe('string');
		expect(signature.length).toBeGreaterThan(0);
	});

	it('ActionAsCommandInterface asCommand method accepts options parameter', async () => {
		const mockAction = new MockCommandAction();
		const options = {verbose: true, output: 'test.txt'};

		// Should not throw when called with options
		expect(() => mockAction.asCommand(options)).not.toThrow();
	});

	it('ActionAsCommandInterface asCommand method returns Promise<void>', async () => {
		const mockAction = new MockCommandAction();
		const result = await mockAction.asCommand({});
		expect(result).toBeUndefined();
	});

	it('ActionAsCommandInterface extends ActionInterface', () => {
		const mockAction = new MockCommandAction();

		// Should have methods from ActionInterface
		expect(typeof mockAction.description).toBe('function');
		expect(typeof mockAction.handle).toBe('function');

		// Should have additional methods from ActionAsCommandInterface
		expect(typeof mockAction.signature).toBe('function');
		expect(typeof mockAction.asCommand).toBe('function');
	});
});
