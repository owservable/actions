'use strict';

import {expect} from 'chai';

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
		expect(runActionAsCommand).to.exist;
		expect(runActionAsCommand).to.be.a('function');
	});

	it('should be an async function', () => {
		expect(runActionAsCommand).to.be.a('function');
		// Test that it returns a promise
		const mockAction = new MockAction();
		const result = runActionAsCommand(mockAction);
		expect(result).to.be.a('promise');
	});

	it('should accept an ActionAsCommandInterface parameter', () => {
		expect(runActionAsCommand.length).to.equal(1);

		// Test that it accepts the correct interface
		const mockAction = new MockAction();
		expect(() => runActionAsCommand(mockAction)).to.not.throw();
	});

	it('should call action.asCommand method', async () => {
		const mockAction = new MockAction();

		// Mock process.argv to avoid Commander.js issues
		const originalArgv = process.argv;
		process.argv = ['node', 'script.js', 'test-command'];

		try {
			await runActionAsCommand(mockAction);
			expect(mockAction.wasAsCommandCalled()).to.be.true;
		} finally {
			process.argv = originalArgv;
		}
	});

	it('should work with actions that have simple signatures', async () => {
		const mockAction = new MockAction('simple-command', 'A simple command');

		const originalArgv = process.argv;
		process.argv = ['node', 'script.js', 'simple-command'];

		try {
			await runActionAsCommand(mockAction);
			expect(mockAction.wasAsCommandCalled()).to.be.true;
		} finally {
			process.argv = originalArgv;
		}
	});

	it('should work with actions that have options', async () => {
		const mockAction = new MockAction('complex-command {--verbose} {--output <file>}', 'A complex command');

		const originalArgv = process.argv;
		process.argv = ['node', 'script.js', 'complex-command', '--verbose', '--output', 'test.txt'];

		try {
			await runActionAsCommand(mockAction);
			expect(mockAction.wasAsCommandCalled()).to.be.true;
		} finally {
			process.argv = originalArgv;
		}
	});

	it('should handle actions with empty signatures', async () => {
		const mockAction = new MockAction('', 'Empty signature command');

		const originalArgv = process.argv;
		process.argv = ['node', 'script.js'];

		try {
			await runActionAsCommand(mockAction);
			expect(mockAction.wasAsCommandCalled()).to.be.true;
		} finally {
			process.argv = originalArgv;
		}
	});

	it('should handle actions with no options', async () => {
		const mockAction = new MockAction('no-options-command', 'Command without options');

		const originalArgv = process.argv;
		process.argv = ['node', 'script.js', 'no-options-command'];

		try {
			await runActionAsCommand(mockAction);
			expect(mockAction.wasAsCommandCalled()).to.be.true;
		} finally {
			process.argv = originalArgv;
		}
	});

	it('should return Promise<void>', async () => {
		const mockAction = new MockAction();

		const originalArgv = process.argv;
		process.argv = ['node', 'script.js', 'test-command'];

		try {
			const result = await runActionAsCommand(mockAction);
			expect(result).to.be.undefined;
		} finally {
			process.argv = originalArgv;
		}
	});

	it('should handle errors gracefully', async () => {
		class ErrorAction implements ActionAsCommandInterface {
			signature(): string {
				return 'error-command';
			}

			description(): string {
				return 'Error command';
			}

			async handle(): Promise<any> {
				return Promise.resolve();
			}

			async asCommand(): Promise<void> {
				throw new Error('Test error');
			}
		}

		const errorAction = new ErrorAction();

		const originalArgv = process.argv;
		process.argv = ['node', 'script.js', 'error-command'];

		try {
			await expect(runActionAsCommand(errorAction)).to.be.rejected;
		} finally {
			process.argv = originalArgv;
		}
	});
});
