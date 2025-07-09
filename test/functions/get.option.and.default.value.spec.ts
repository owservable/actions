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
});
