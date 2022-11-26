'use strict';

import ActionInterface from './action.interface';

export default interface ActionAsControllerInterface extends ActionInterface {
	routes(): Promise<any>;

	asController(request: any, reply: any): Promise<void>;
}
