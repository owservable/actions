'use strict';

// functions
import findAction from './functions/find.action';
import runActionAsCommand from './functions/run.action.as.command';
import getOptionAndDefaultValue from './functions/get.option.and.default.value';

// interfaces
import ActionInterface from './interfaces/action.interface';
import ActionAsWorkerInterface from './interfaces/action.as.worker.interface';
import ActionAsCronjobInterface from './interfaces/action.as.cronjob.interface';
import ActionAsControllerInterface from './interfaces/action.as.controller.interface';
import ActionAsCommandInterface from './interfaces/action.as.command.interface';

// abstracts
import Action from './abstracts/action';

export {
	// functions
	findAction,
	runActionAsCommand,
	getOptionAndDefaultValue,

	// interfaces
	ActionInterface,
	ActionAsWorkerInterface,
	ActionAsCronjobInterface,
	ActionAsControllerInterface,
	ActionAsCommandInterface,

	// abstracts
	Action
};

const OwservableActions = {};
export default OwservableActions;
