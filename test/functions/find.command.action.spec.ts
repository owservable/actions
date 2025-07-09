'use strict';

import findCommandAction from '../../src/functions/find.command.action';

describe('find.command.action tests', () => {
	it('findCommandAction exists', () => {
		expect(findCommandAction).toBeDefined();
		expect(typeof findCommandAction).toBe('function');
	});

	it('should be a function that accepts root and cliCommand parameters', () => {
		expect(typeof findCommandAction).toBe('function');
		expect(findCommandAction.length).toBe(2);
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

	it('should throw ENOENT for various path formats that don\'t exist', () => {
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
