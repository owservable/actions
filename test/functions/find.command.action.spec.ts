'use strict';

import {expect} from 'chai';

import findCommandAction from '../../src/functions/find.command.action';

describe('find.command.action tests', () => {
	it('findCommandAction exists', () => {
		expect(findCommandAction).to.exist;
		expect(findCommandAction).to.be.a('function');
	});

	it('should be a function that accepts root and cliCommand parameters', () => {
		expect(findCommandAction).to.be.a('function');
		expect(findCommandAction.length).to.equal(2);
	});

	it('should return undefined when called with empty root path', () => {
		// This test validates the function signature and basic behavior
		// without needing complex mocking
		const result = findCommandAction('', 'test-command');
		expect(result).to.be.undefined;
	});

	it('should return undefined when called with empty command', () => {
		const result = findCommandAction('/test/root', '');
		expect(result).to.be.undefined;
	});

	it('should return undefined when called with non-existent paths', () => {
		const result = findCommandAction('/non/existent/path', 'test-command');
		expect(result).to.be.undefined;
	});

	it('should handle string parameters correctly', () => {
		// Test parameter validation
		expect(() => findCommandAction('/test', 'command')).to.not.throw();
	});

	it('should work with valid root path format', () => {
		// Test with various path formats
		expect(() => findCommandAction('./test', 'command')).to.not.throw();
		expect(() => findCommandAction('../test', 'command')).to.not.throw();
		expect(() => findCommandAction('/absolute/path', 'command')).to.not.throw();
	});

	it('should handle command names with various formats', () => {
		// Test with different command formats
		expect(() => findCommandAction('/test', 'simple-command')).to.not.throw();
		expect(() => findCommandAction('/test', 'command_with_underscores')).to.not.throw();
		expect(() => findCommandAction('/test', 'CommandWithCamelCase')).to.not.throw();
	});
});
