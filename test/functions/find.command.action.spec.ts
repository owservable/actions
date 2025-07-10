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

	it('should find and return matching action when it exists', () => {
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
		const result = findCommandAction(testRoot, 'test-command');

		expect(result).toBeDefined();
		expect(result).not.toBeNull();
		expect(result!.signature()).toBe('test-command --option');
		expect(result!.description()).toBe('Test action for testing');

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should return null when no matching action is found', () => {
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
		const result = findCommandAction(testRoot, 'non-existent-command');

		expect(result).toBeNull();

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle empty root path by throwing error', () => {
		// The function should throw an error for invalid root paths
		expect(() => findCommandAction('', 'test-command')).toThrow('ENOENT');
	});

	it('should handle empty command with non-existent path', () => {
		expect(() => findCommandAction('/test/root', '')).toThrow('ENOENT');
	});

	it('should handle non-existent paths by throwing error', () => {
		expect(() => findCommandAction('/non/existent/path', 'test-command')).toThrow('ENOENT');
	});

	it('should throw error for invalid paths', () => {
		// Test parameter validation - expects error for non-existent paths
		expect(() => findCommandAction('/test', 'command')).toThrow('ENOENT');
	});

	it('should throw error for various path formats that don\'t exist', () => {
		// Test with various path formats - all should throw error
		expect(() => findCommandAction('./nonexistent', 'command')).toThrow('ENOENT');
		expect(() => findCommandAction('../nonexistent', 'command')).toThrow('ENOENT');
		expect(() => findCommandAction('/absolute/nonexistent/path', 'command')).toThrow('ENOENT');
	});

	it('should handle malformed action files gracefully', () => {
		// Create a test directory structure with malformed action
		const testRoot = path.join(__dirname, '../test-actions-root-malformed');
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
		const result = findCommandAction(testRoot, 'any-command');

		expect(result).toBeNull(); // Should return null, not throw

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should log errors when not in test environment', () => {
		// Create a test directory structure with malformed action
		const testRoot = path.join(__dirname, '../test-actions-root-malformed-with-logging');
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
			const result = findCommandAction(testRoot, 'any-command');

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

	it('should handle non-Error exceptions in logging', () => {
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
			const result = findCommandAction(testRoot, 'any-command');

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
});
