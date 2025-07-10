'use strict';

export const getOptionAndDefaultValue = (config: string): {option: string; defaultValue: string} => {
	let defaultValue: string | undefined;
	let option: string = config.slice(1, -1).trim();

	// option has default value
	if (option.indexOf('=') >= 0) {
		defaultValue = option.substring(option.indexOf('=') + 1).trim();
		option = option.replace('=' + defaultValue, '').trim();
	}

	return {option, defaultValue};
};
export default getOptionAndDefaultValue;
