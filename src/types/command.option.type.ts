'use strict';

/**
 * Represents a command option with name and default value
 */
type CommandOptionType = {
	name: string;
	defaultValue?: string;
	required?: boolean;
};

export default CommandOptionType; 