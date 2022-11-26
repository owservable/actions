'use strict';

export const getOptionAndDefaultValue = (config: string): {option: string; defaultValue: string} => {
	let defaultValue;
	let option = config.substring(1).substring(-1).slice(0, -1);

	// option has default value
	if (option.indexOf('=') >= 0) {
		defaultValue = option.substring(option.indexOf('=') + 1).slice(0, -1);
		option = option.replace('=' + defaultValue, '');
	}

	return {option, defaultValue};
};
export default getOptionAndDefaultValue;
