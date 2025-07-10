'use strict';

/**
 * Command execution context
 */
type CommandContextType = {
	signature: string;
	options: Record<string, any>;
	verbose?: boolean;
};

export default CommandContextType; 