'use strict';

import CommandOptionType from './command.option.type';

/**
 * Represents a command signature with command name and optional parameters
 */
type CommandSignatureType = {
	command: string;
	parameters: string[];
	options: CommandOptionType[];
};

export default CommandSignatureType;
