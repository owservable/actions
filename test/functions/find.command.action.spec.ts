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
		expect(result.signature()).toBe('test-command --option');
		expect(result.description()).toBe('Test action for testing');

		// Clean up
		fs.rmSync(testRoot, {recursive: true});
	});

	it('should handle empty root path by throwing ENOENT error', () => {
		// This test validates the function signature and basic behavior
		// The function throws ENOENT when the path doesn't exist
		expect(() => findCommandAction('', 'test-command')).toThrow('ENOENT');
	});

	it('should handle empty command with non-existent path', () => {
		expect(() => findCommandAction('/test/root', '')).toThrow('ENOENT');
	});

	it('should handle non-existent paths by throwing ENOENT error', () => {
		expect(() => findCommandAction('/non/existent/path', 'test-command')).toThrow('ENOENT');
	});

	it('should throw ENOENT for invalid paths', () => {
		// Test parameter validation - expects ENOENT for non-existent paths
		expect(() => findCommandAction('/test', 'command')).toThrow('ENOENT');
	});

	it("should throw ENOENT for various path formats that don't exist", () => {
		// Test with various path formats - all should throw ENOENT
		expect(() => findCommandAction('./nonexistent', 'command')).toThrow('ENOENT');
		expect(() => findCommandAction('../nonexistent', 'command')).toThrow('ENOENT');
		expect(() => findCommandAction('/absolute/nonexistent/path', 'command')).toThrow('ENOENT');
	});

	it('should throw ENOENT for various command formats with non-existent paths', () => {
		// Test with different command formats - all should throw ENOENT
		expect(() => findCommandAction('/test', 'simple-command')).toThrow('ENOENT');
		expect(() => findCommandAction('/test', 'command_with_underscores')).toThrow('ENOENT');
		expect(() => findCommandAction('/test', 'CommandWithCamelCase')).toThrow('ENOENT');
	});
});
