'use strict';

// functions
import findCommandAction from './functions/find.command.action';
import runActionAsCommand from './functions/run.action.as.command';
import getOptionAndDefaultValue from './functions/get.option.and.default.value';

// interfaces
import type ActionInterface from './interfaces/action.interface';
import type ActionAsWorkerInterface from './interfaces/action.as.worker.interface';
import type ActionAsWatcherInterface from './interfaces/action.as.watcher.interface';
import type ActionAsCommandInterface from './interfaces/action.as.command.interface';
import type ActionAsCronjobInterface from './interfaces/action.as.cronjob.interface';
import type ActionAsControllerInterface from './interfaces/action.as.controller.interface';

// abstracts
import Action from './abstracts/action';

// types
import type CommandSignatureType from './types/command.signature.type';
import type CommandOptionType from './types/command.option.type';
import type CommandContextType from './types/command.context.type';

export {findCommandAction, runActionAsCommand, getOptionAndDefaultValue, Action};
export type {
	ActionInterface,
	ActionAsWorkerInterface,
	ActionAsWatcherInterface,
	ActionAsCommandInterface,
	ActionAsCronjobInterface,
	ActionAsControllerInterface,
	CommandSignatureType,
	CommandOptionType,
	CommandContextType
};
const OwservableActions = {};
export default OwservableActions;
