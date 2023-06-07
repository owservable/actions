'use strict';

import {expect} from 'chai';

import getOptionAndDefaultValue from '../../src/functions/get.option.and.default.value';

describe('get.option.and.default.value tests', () => {
	it('getOptionAndDefaultValue exists', () => {
		expect(getOptionAndDefaultValue).to.exist;
		expect(getOptionAndDefaultValue).to.be.a('function');
	});

	it('getOptionAndDefaultValue works', () => {
		const signature = 'some_command {-f, --foo <foo>} {-b, --boo <boo>}';
		const options: string[] = signature.match(/{([^}]*)}/g);
		expect(options).to.have.length(2);

		const {option: option1, defaultValue: defaultValue1} = getOptionAndDefaultValue(options[0]);
		expect(option1).to.equal('-f, --foo <foo>');
		expect(defaultValue1).to.be.undefined;

		const {option: option2, defaultValue: defaultValue2} = getOptionAndDefaultValue(options[1]);
		expect(option2).to.equal('-b, --boo <boo>');
		expect(defaultValue2).to.be.undefined;
	});

	it('getOptionAndDefaultValue works with default value', () => {
		const signature = 'some_command {-f, --foo <foo>=yei} {-b, --boo <boo>}';
		const options: string[] = signature.match(/{([^}]*)}/g);
		expect(options).to.have.length(2);

		const {option: option1, defaultValue: defaultValue1} = getOptionAndDefaultValue(options[0]);
		expect(option1).to.equal('-f, --foo <foo>');
		expect(defaultValue1).to.equal('yei');

		const {option: option2, defaultValue: defaultValue2} = getOptionAndDefaultValue(options[1]);
		expect(option2).to.equal('-b, --boo <boo>');
		expect(defaultValue2).to.be.undefined;
	});
});
