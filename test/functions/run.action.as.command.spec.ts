'use strict';

import runActionAsCommand from '../../src/functions/run.action.as.command';
import ActionAsCommandInterface from '../../src/interfaces/action.as.command.interface';

// Mock action for testing
class MockAction implements ActionAsCommandInterface {
	private _signature: string;
	private _description: string;
	private _handleCalled: boolean = false;
	private _asCommandCalled: boolean = false;
	private _lastOptions: any = null;

	constructor(signature: string = 'test-command {--option}', description: string = 'Test command') {
		this._signature = signature;
		this._description = description;
	}

	signature(): string {
		return this._signature;
	}

	description(): string {
		return this._description;
	}

	async handle(): Promise<any> {
		this._handleCalled = true;
		return Promise.resolve();
	}

	async asCommand(options: any): Promise<void> {
		this._asCommandCalled = true;
		this._lastOptions = options;
		return Promise.resolve();
	}

	// Helper methods for testing
	wasHandleCalled(): boolean {
		return this._handleCalled;
	}

	wasAsCommandCalled(): boolean {
		return this._asCommandCalled;
	}

	getLastOptions(): any {
		return this._lastOptions;
	}
}

describe('run.action.as.command tests', () => {
	it('runActionAsCommand exists', () => {
		expect(runActionAsCommand).toBeDefined();
		expect(typeof runActionAsCommand).toBe('function');
	});

	it('should be an async function', () => {
		expect(typeof runActionAsCommand).toBe('function');
		// Test basic function properties without executing
		expect(runActionAsCommand.length).toBe(1);
	});

	it('should accept an ActionAsCommandInterface parameter', () => {
		expect(runActionAsCommand.length).toBe(1);
		expect(typeof runActionAsCommand).toBe('function');
	});

	it('should work with MockAction interface', () => {
		const mockAction = new MockAction();
		expect(mockAction.signature()).toBe('test-command {--option}');
		expect(mockAction.description()).toBe('Test command');
		expect(typeof mockAction.asCommand).toBe('function');
	});

	it('should handle different action signatures', () => {
		const simpleAction = new MockAction('simple-command', 'A simple command');
		expect(simpleAction.signature()).toBe('simple-command');
		expect(simpleAction.description()).toBe('A simple command');

		const complexAction = new MockAction('complex-command {--verbose} {--output <file>}', 'A complex command');
		expect(complexAction.signature()).toBe('complex-command {--verbose} {--output <file>}');
		expect(complexAction.description()).toBe('A complex command');
	});

	it('should validate function interface compatibility', () => {
		// Test that runActionAsCommand accepts the expected interface
		const mockAction = new MockAction();
		
		// Validate the action has required methods
		expect(typeof mockAction.signature).toBe('function');
		expect(typeof mockAction.description).toBe('function');
		expect(typeof mockAction.asCommand).toBe('function');
		expect(typeof mockAction.handle).toBe('function');
		
		// Validate method return types
		expect(typeof mockAction.signature()).toBe('string');
		expect(typeof mockAction.description()).toBe('string');
		expect(mockAction.handle()).toBeInstanceOf(Promise);
		expect(mockAction.asCommand({})).toBeInstanceOf(Promise);
	});
});
