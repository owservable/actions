'use strict';

import ActionInterface from './action.interface';

export default interface ActionAsCommandInterface extends ActionInterface {
	signature(): string;

	asCommand(options: any): Promise<void>;
}
