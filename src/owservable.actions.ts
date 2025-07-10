'use strict';

// functions
import findCommandAction from './functions/find.command.action';
import runActionAsCommand from './functions/run.action.as.command';
import getOptionAndDefaultValue from './functions/get.option.and.default.value';

// interfaces
import ActionInterface from './interfaces/action.interface';
import ActionAsWorkerInterface from './interfaces/action.as.worker.interface';
import ActionAsWatcherInterface from './interfaces/action.as.watcher.interface';
import ActionAsCommandInterface from './interfaces/action.as.command.interface';
import ActionAsCronjobInterface from './interfaces/action.as.cronjob.interface';
import ActionAsControllerInterface from './interfaces/action.as.controller.interface';

// abstracts
import Action from './abstracts/action';

// types
import CommandSignatureType from './types/command.signature.type';
import CommandOptionType from './types/command.option.type';
import CommandContextType from './types/command.context.type';

export {
	// functions
	findCommandAction,
	runActionAsCommand,
	getOptionAndDefaultValue,

	// interfaces
	ActionInterface,
	ActionAsWorkerInterface,
	ActionAsWatcherInterface,
	ActionAsCommandInterface,
	ActionAsCronjobInterface,
	ActionAsControllerInterface,

	// abstracts
	Action,

	// types
	CommandSignatureType,
	CommandOptionType,
	CommandContextType
};
