'use strict';

import getOptionAndDefaultValue from '../../src/functions/get.option.and.default.value';

describe('get.option.and.default.value tests', () => {
	it('getOptionAndDefaultValue exists', () => {
		expect(getOptionAndDefaultValue).toBeDefined();
		expect(typeof getOptionAndDefaultValue).toBe('function');
	});

	it('getOptionAndDefaultValue works', () => {
		const signature = 'some_command {-f, --foo <foo>} {-b, --boo <boo>}';
		const options: string[] = signature.match(/{([^}]*)}/g);
		expect(options).toHaveLength(2);

		const {option: option1, defaultValue: defaultValue1} = getOptionAndDefaultValue(options[0]);
		expect(option1).toBe('-f, --foo <foo>');
		expect(defaultValue1).toBeUndefined();

		const {option: option2, defaultValue: defaultValue2} = getOptionAndDefaultValue(options[1]);
		expect(option2).toBe('-b, --boo <boo>');
		expect(defaultValue2).toBeUndefined();
	});

	it('getOptionAndDefaultValue works with default value', () => {
		const signature = 'some_command {-f, --foo <foo>=yei} {-b, --boo <boo>}';
		const options: string[] = signature.match(/{([^}]*)}/g);
		expect(options).toHaveLength(2);

		const {option: option1, defaultValue: defaultValue1} = getOptionAndDefaultValue(options[0]);
		expect(option1).toBe('-f, --foo <foo>');
		expect(defaultValue1).toBe('yei');

		const {option: option2, defaultValue: defaultValue2} = getOptionAndDefaultValue(options[1]);
		expect(option2).toBe('-b, --boo <boo>');
		expect(defaultValue2).toBeUndefined();
	});

	it('DEMONSTRATES BUG: substring(-1) does not work as expected', () => {
		// This test demonstrates the bug in the line:
		// let option: string = config.substring(1).substring(-1).slice(0, -1).trim();

		// The bug is that substring(-1) treats negative arguments as 0,
		// so substring(-1) is equivalent to substring(0), which returns the entire string

		const testString = 'hello world';

		// What the developer probably intended (remove last character):
		const intended = testString.slice(0, -1); // "hello worl"

		// What substring(-1) actually does (returns entire string):
		const buggySubstring = testString.substring(-1); // "hello world"

		// Demonstrate the bug:
		expect(buggySubstring).toBe('hello world'); // substring(-1) returns full string
		expect(intended).toBe('hello worl'); // slice(0, -1) properly removes last char
		expect(buggySubstring).not.toBe(intended); // They are different!

		// Show how this affects our function:
		const config = '{-f, --foo <foo>}';
		const step1 = config.substring(1); // "-f, --foo <foo>}"
		const step2 = step1.substring(-1); // "-f, --foo <foo>}" (BUG: should remove last char)
		const step3 = step2.slice(0, -1); // "-f, --foo <foo>" (this compensates for the bug)

		expect(step1).toBe('-f, --foo <foo>}');
		expect(step2).toBe('-f, --foo <foo>}'); // Bug: substring(-1) didn't remove anything
		expect(step3).toBe('-f, --foo <foo>'); // slice(0, -1) saves the day

		// The function accidentally works because slice(0, -1) compensates,
		// but the substring(-1) call is redundant and represents a misunderstanding
	});
});
