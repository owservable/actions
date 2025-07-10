'use strict';

import findCommandAction from '../../src/functions/find.command.action';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
		// Create a test directory structure in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-' + Date.now());
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
		// Create a test directory structure with no matching actions in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-no-match-' + Date.now());
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

	it("should throw error for various path formats that don't exist", async () => {
		// Test with various path formats - all should throw error
		await expect(findCommandAction('./nonexistent', 'command')).rejects.toThrow('ENOENT');
		await expect(findCommandAction('../nonexistent', 'command')).rejects.toThrow('ENOENT');
		await expect(findCommandAction('/absolute/nonexistent/path', 'command')).rejects.toThrow('ENOENT');
	});

	it('should handle malformed action files gracefully', async () => {
		// Create a test directory structure with malformed action in OS temp directory
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
		// Create a test directory structure with malformed action in OS temp directory
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
			expect(mockConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('[@owservable/actions] Failed to load action from'), expect.anything());
		} finally {
			// Restore original values
			process.env.NODE_ENV = originalNodeEnv;
			console.warn = originalConsoleWarn;
		}

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle non-Error exceptions in logging', async () => {
		// Create a test directory structure with action that throws non-Error in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-non-error-' + Date.now());
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
		// Create a test directory structure with action that has no default export in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-no-default-' + Date.now());
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
		// Create a test directory structure with action that has undefined default export in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-undefined-default-' + Date.now());
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

	it('should handle action files that throw errors in constructor', async () => {
		// Create a test directory structure with action that throws in constructor in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-constructor-error-' + Date.now());
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'constructor-error-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with constructor that throws
		const actionFile = path.join(testActionDir, 'constructor-error-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class ConstructorErrorAction {
				constructor() {
					throw new Error('Constructor error');
				}
				
				signature() {
					return 'constructor-error-command --option';
				}
			}
			
			module.exports = { default: ConstructorErrorAction };
		`
		);

		// Test that files with constructor errors are handled gracefully
		const result = await findCommandAction(testRoot, 'constructor-error-command');

		expect(result).toBeNull(); // Should return null, not throw

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle actions with null signature', async () => {
		// Create a test directory structure with action that returns null signature in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-null-signature-' + Date.now());
		const actionsDir = path.join(testRoot, 'actions');
		const testActionDir = path.join(actionsDir, 'null-signature-action');

		// Clean up any existing test directory
		if (fs.existsSync(testRoot)) {
			fs.rmSync(testRoot, {recursive: true});
		}

		// Create directory structure
		fs.mkdirSync(testActionDir, {recursive: true});

		// Create an action file with null signature
		const actionFile = path.join(testActionDir, 'null-signature-action.js');
		fs.writeFileSync(
			actionFile,
			`
			class NullSignatureAction {
				signature() {
					return null;
				}
			}
			
			module.exports = { default: NullSignatureAction };
		`
		);

		// Test that actions with null signature are skipped
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is invalid

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle actions with non-string signature', async () => {
		// Create a test directory structure with action that returns non-string signature in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-non-string-signature-' + Date.now());
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
					return 12345; // Non-string signature
				}
			}
			
			module.exports = { default: NonStringSignatureAction };
		`
		);

		// Test that actions with non-string signature are skipped
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is invalid

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle actions with empty signature', async () => {
		// Create a test directory structure with action that returns empty signature in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-empty-signature-' + Date.now());
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
			}
			
			module.exports = { default: EmptySignatureAction };
		`
		);

		// Test that actions with empty signature are skipped
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since signature is invalid

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle actions with whitespace-only signature', async () => {
		// Create a test directory structure with action that returns whitespace-only signature in OS temp directory
		const testRoot = path.join(os.tmpdir(), 'test-actions-root-whitespace-signature-' + Date.now());
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
					return '   \\n\\t   '; // Only whitespace
				}
			}
			
			module.exports = { default: WhitespaceSignatureAction };
		`
		);

		// Test that actions with whitespace-only signature are skipped
		const result = await findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null since command part is empty

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});
});
