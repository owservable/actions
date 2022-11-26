'use strict';

import ActionInterface from './action.interface';

export default interface ActionAsWorkerInterface extends ActionInterface {
	asWorker(): Promise<void>;

	asWorkerInit?(): Promise<void>;
}
