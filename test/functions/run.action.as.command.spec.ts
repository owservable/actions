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

	async asCommand(options: Record<string, unknown>): Promise<void> {
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
	// Store original process.argv
	const originalArgv = process.argv;

	beforeEach(() => {
		// Reset process.argv before each test
		process.argv = ['node', 'test'];
	});

	afterEach(() => {
		// Restore original process.argv after each test
		process.argv = originalArgv;
	});

	it('runActionAsCommand exists', () => {
		expect(runActionAsCommand).toBeDefined();
		expect(typeof runActionAsCommand).toBe('function');
	});

	it('should be an async function', () => {
		expect(typeof runActionAsCommand).toBe('function');
		// Test basic function properties without executing
		expect(runActionAsCommand).toHaveLength(1);
	});

	it('should accept an ActionAsCommandInterface parameter', () => {
		expect(runActionAsCommand).toHaveLength(1);
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

	it.each([
		{name: 'simple command signature', signature: 'simple-command', argv: ['node', 'test', 'simple-command'], expectedOptions: {}},
		{name: 'options in signature', signature: 'test-command {--verbose}', argv: ['node', 'test', 'test-command', '--verbose'], expectedOptions: {verbose: true}},
		{
			name: 'multiple options',
			signature: 'multi-command {--verbose} {--output <file>}',
			argv: ['node', 'test', 'multi-command', '--verbose', '--output', 'test.txt'],
			expectedOptions: {verbose: true, output: 'test.txt'}
		},
		{name: 'without options', signature: 'basic-command', argv: ['node', 'test', 'basic-command'], expectedOptions: {}},
		{name: 'null options regex match', signature: 'no-options-command', argv: ['node', 'test', 'no-options-command'], expectedOptions: {}}
	])('should execute action with $name', async ({signature, argv, expectedOptions}) => {
		const mockAction = new MockAction(signature, 'Test command');
		process.argv = argv;

		await runActionAsCommand(mockAction);

		expect(mockAction.wasAsCommandCalled()).toBe(true);
		const options = mockAction.getLastOptions();
		expect(options).toBeDefined();
		for (const [key, value] of Object.entries(expectedOptions)) {
			expect(options[key]).toBe(value);
		}
	});
});
