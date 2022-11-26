'use strict';

import ActionInterface from './action.interface';

export default interface ActionAsWatcherInterface extends ActionInterface {
	asWatcher(): Promise<void>;

	asWatcherInit?(): Promise<void>;
}
