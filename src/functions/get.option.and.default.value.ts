'use strict';

export const getOptionAndDefaultValue = (config: string): {option: string; defaultValue: string} => {
	let defaultValue;
	let option = config.substring(1).substring(-1).slice(0, -1).trim();

	// option has default value
	if (option.indexOf('=') >= 0) {
		defaultValue = option.substring(option.indexOf('=') + 1).trim();
		option = option.replace('=' + defaultValue, '').trim();
	}

	return {option, defaultValue};
};
export default getOptionAndDefaultValue;
