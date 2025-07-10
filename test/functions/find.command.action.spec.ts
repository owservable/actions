'use strict';

import findCommandAction from '../../src/functions/find.command.action';
import * as fs from 'fs';
import * as path from 'path';

describe('find.command.action tests', () => {
	it('findCommandAction exists', () => {
		expect(findCommandAction).toBeDefined();
		expect(typeof findCommandAction).toBe('function');
	});

	it('should be a function that accepts root and cliCommand parameters', () => {
		expect(typeof findCommandAction).toBe('function');
		expect(findCommandAction.length).toBe(2);
	});

	it('should find and return matching action when it exists', async () => {
		// Create a test directory structure
		const testRoot = path.join(__dirname, '../test-actions-root');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'test-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create a test action file
		const actionFile = path.join(testActionDir, 'test-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class TestAction {
				signature() {
					return 'test-command --option';
				}
				
				description() {
					return 'Test action for testing';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: TestAction };
		`
		);

		// Test that the action is found and returned
		const result = await findCommandAction(testRoot, 'test-command');

		expect(result).toBeDefined();
		expect(result).not.toBeNull();
		expect(result!.signature()).toBe('test-command --option');
		expect(result!.description()).toBe('Test action for testing');

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should return null when no matching action is found', async () => {
		// Create a test directory structure with no matching actions
		const testRoot = path.join(__dirname, '../test-actions-root-no-match');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'test-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create a test action file with different command
		const actionFile = path.join(testActionDir, 'test-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class TestAction {
				signature() {
					return 'different-command --option';
				}
				
				description() {
					return 'Test action for testing';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: TestAction };
		`
		);

		// Test that no action is found for non-matching command
		const result = await findCommandAction(testRoot, 'non-existent-command');

		expect(result).toBeNull();

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle empty root path by throwing error', async () => {
		// The function should throw an error for invalid root paths
		await expect(findCommandAction('', 'test-command')).rejects.toThrow('ENOENT');
	});

	it('should handle empty command with non-existent path', async () => {
		await expect(findCommandAction('/test/root', '')).rejects.toThrow('ENOENT');
	});

	it('should handle non-existent paths by throwing error', async () => {
		await expect(findCommandAction('/non/existent/path', 'test-command')).rejects.toThrow('ENOENT');
	});

	it('should throw error for invalid paths', async () => {
		// Test parameter validation - expects error for non-existent paths
		await expect(findCommandAction('/test', 'command')).rejects.toThrow('ENOENT');
	});

	it('should throw error for various path formats that don\'t exist', async () => {
		// Test with various path formats - all should throw error
		await expect(findCommandAction('./nonexistent', 'command')).rejects.toThrow('ENOENT');
		await expect(findCommandAction('../nonexistent', 'command')).rejects.toThrow('ENOENT');
		await expect(findCommandAction('/absolute/nonexistent/path', 'command')).rejects.toThrow('ENOENT');
	});

	it('should handle malformed action files gracefully', async () => {
		// Create a test directory structure with malformed action in temp directory
		const os = require('os');
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-malformed-' + Date.now());
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'malformed-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create a malformed action file
		const actionFile = path.join(testActionDir, 'malformed-action.js');
		fs.writeFileSync(actionFile, 'this is not valid javascript{{{');

		// Test that malformed files are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null, not throw

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should log errors when not in test environment', async () => {
		// Create a test directory structure with malformed action in temp directory
		const os = require('os');
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-malformed-with-logging-' + Date.now());
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'malformed-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create a malformed action file
		const actionFile = path.join(testActionDir, 'malformed-action.js');
		fs.writeFileSync(actionFile, 'this is not valid javascript{{{');

		// Temporarily change NODE_ENV to test the logging path
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		// Mock console.warn to capture the log
		const originalConsoleWarn = console.warn;
		const mockConsoleWarn = jest.fn();
		console.warn = mockConsoleWarn;

		try {
			// Test that malformed files are handled gracefully and logged
			const result = await findCommandAction(testRoot, 'any-command');

			expect(result).toBeNull(); // Should return null, not throw
			
			expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining('[@owservable/actions] Failed to load action from'),
				expect.anything()
			);
		} finally {
			// Restore original values
			process.env.NODE_ENV = originalNodeEnv;
			console.warn = originalConsoleWarn;
		}

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle non-Error exceptions in logging', async () => {
		// Create a test directory structure with action that throws non-Error
		const testRoot = path.join(__dirname, '../test-actions-root-non-error');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'non-error-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file that throws a non-Error object
		const actionFile = path.join(testActionDir, 'non-error-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class NonErrorAction {
				signature() {
					throw 'This is a string error, not an Error object';
				}
			}
			
			module.exports = { default: NonErrorAction };
		`
		);

		// Temporarily change NODE_ENV to test the logging path
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		// Mock console.warn to capture the log
		const originalConsoleWarn = console.warn;
		const mockConsoleWarn = jest.fn();
		console.warn = mockConsoleWarn;

		try {
			// Test that non-Error exceptions are handled gracefully and logged
			const result = await findCommandAction(testRoot, 'any-command');

			expect(result).toBeNull(); // Should return null, not throw
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining('[@owservable/actions] Failed to load action from'),
				'This is a string error, not an Error object'
			);
		} finally {
			// Restore original values
			process.env.NODE_ENV = originalNodeEnv;
			console.warn = originalConsoleWarn;
		}

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action files with no default export', async () => {
		// Create a test directory structure with action that has no default export
		const testRoot = path.join(__dirname, '../test-actions-root-no-default');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'no-default-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with no default export
		const actionFile = path.join(testActionDir, 'no-default-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class NoDefaultAction {
				signature() {
					return 'no-default-command --option';
				}
			}
			
			// No default export - module.exports = {};
			module.exports = {};
		`
		);

		// Test that files with no default export are skipped
		const result = await findCommandAction(testRoot, 'no-default-command');

		expect(result).toBeNull(); // Should return null since no valid action found

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action files with undefined default export', async () => {
		// Create a test directory structure with action that has undefined default export
		const testRoot = path.join(__dirname, '../test-actions-root-undefined-default');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'undefined-default-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with undefined default export
		const actionFile = path.join(testActionDir, 'undefined-default-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class UndefinedDefaultAction {
				signature() {
					return 'undefined-default-command --option';
				}
			}
			
			// Undefined default export
			module.exports = { default: undefined };
		`
		);

		// Test that files with undefined default export are skipped
		const result = await findCommandAction(testRoot, 'undefined-default-command');

		expect(result).toBeNull(); // Should return null since no valid action found

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action with signature that returns undefined', async () => {
		// Create a test directory structure with action that has signature returning undefined
		const testRoot = path.join(__dirname, '../test-actions-root-undefined-signature');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'undefined-signature-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with signature that returns undefined
		const actionFile = path.join(testActionDir, 'undefined-signature-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class UndefinedSignatureAction {
				signature() {
					return undefined;
				}
				
				description() {
					return 'Action with undefined signature';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: UndefinedSignatureAction };
		`
		);

		// Test that actions with undefined signature are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is undefined

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle actions that throw during instantiation when not in test environment', async () => {
		// Create a test directory structure with action that throws during constructor
		const testRoot = path.join(__dirname, '../test-actions-root-constructor-error');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'constructor-error-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file that throws during constructor
		const actionFile = path.join(testActionDir, 'constructor-error-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class ConstructorErrorAction {
				constructor() {
					throw new Error('Constructor failed');
				}
				
				signature() {
					return 'constructor-error-command';
				}
			}
			
			module.exports = { default: ConstructorErrorAction };
		`
		);

		// Temporarily change NODE_ENV to test the logging path
		const originalNodeEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';

		// Mock console.warn to capture the log
		const originalConsoleWarn = console.warn;
		const mockConsoleWarn = jest.fn();
		console.warn = mockConsoleWarn;

		try {
			// Test that constructor errors are handled gracefully and logged
			const result = await findCommandAction(testRoot, 'constructor-error-command');

			expect(result).toBeNull(); // Should return null, not throw
			expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining('[@owservable/actions] Failed to load action from'),
				'Constructor failed'
			);
		} finally {
			// Restore original values
			process.env.NODE_ENV = originalNodeEnv;
			console.warn = originalConsoleWarn;
		}

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action with empty signature string', async () => {
		// Create a test directory structure with action that has empty signature
		const testRoot = path.join(__dirname, '../test-actions-root-empty-signature');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'empty-signature-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with empty signature
		const actionFile = path.join(testActionDir, 'empty-signature-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class EmptySignatureAction {
				signature() {
					return '';
				}
				
				description() {
					return 'Action with empty signature';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: EmptySignatureAction };
		`
		);

		// Test that actions with empty signature are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is empty

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action with non-string signature', async () => {
		// Create a test directory structure with action that has non-string signature
		const testRoot = path.join(__dirname, '../test-actions-root-non-string-signature');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'non-string-signature-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with non-string signature
		const actionFile = path.join(testActionDir, 'non-string-signature-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class NonStringSignatureAction {
				signature() {
					return 123; // Return number instead of string
				}
				
				description() {
					return 'Action with non-string signature';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: NonStringSignatureAction };
		`
		);

		// Test that actions with non-string signature are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is not a string

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action with whitespace-only signature', async () => {
		// Create a test directory structure with action that has whitespace-only signature
		const testRoot = path.join(__dirname, '../test-actions-root-whitespace-signature');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'whitespace-signature-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with whitespace-only signature
		const actionFile = path.join(testActionDir, 'whitespace-signature-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class WhitespaceSignatureAction {
				signature() {
					return '   '; // Only whitespace
				}
				
				description() {
					return 'Action with whitespace-only signature';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: WhitespaceSignatureAction };
		`
		);

		// Test that actions with whitespace-only signature are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature becomes empty after trim

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should respect verbose option when set to true', async () => {
		// Create a test directory structure with malformed action
		const testRoot = path.join(__dirname, '../test-actions-root-verbose-test');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'malformed-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create a malformed action file
		const actionFile = path.join(testActionDir, 'malformed-action.js');
		fs.writeFileSync(actionFile, 'this is not valid javascript{{{');

		// Mock console.warn to capture the log
		const originalConsoleWarn = console.warn;
		const mockConsoleWarn = jest.fn();
		console.warn = mockConsoleWarn;

		try {
			// Test with explicit verbose: true option
			const result = await findCommandAction(testRoot, 'any-command', {verbose: true});

			expect(result).toBeNull(); // Should return null, not throw
			expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
			expect(mockConsoleWarn).toHaveBeenCalledWith(
				expect.stringContaining('[@owservable/actions] Failed to load action from'),
				expect.anything()
			);
		} finally {
			// Restore original values
			console.warn = originalConsoleWarn;
		}

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action with signature that splits to empty array', async () => {
		// Create a test directory structure with action that has signature that results in empty split
		const testRoot = path.join(__dirname, '../test-actions-root-empty-split');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'empty-split-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with signature that results in empty split after trim
		const actionFile = path.join(testActionDir, 'empty-split-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class EmptySplitAction {
				signature() {
					// This should result in empty array after trim().split(/\\s+/)
					// When trimmed, this becomes empty string, which split will return ['']
					// But we need to find something that truly returns empty array
					const sig = '';
					return sig;
				}
				
				description() {
					return 'Action with empty signature after trim';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: EmptySplitAction };
		`
		);

		// Test that actions with empty signature after trim are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is empty

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle action with signature containing only first empty part', async () => {
		// Create a test directory structure with action that has first command part empty
		const testRoot = path.join(__dirname, '../test-actions-root-empty-first-part');
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'empty-first-part-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with signature where first part is empty
		const actionFile = path.join(testActionDir, 'empty-first-part-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class EmptyFirstPartAction {
				signature() {
					return ' some-other-parts'; // First part will be empty string after split
				}
				
				description() {
					return 'Action with empty first part';
				}
				
				async asCommand() {
					return;
				}
			}
			
			module.exports = { default: EmptyFirstPartAction };
		`
		);

		// Test that actions with empty first command part are handled gracefully
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since first part is empty

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});
});
