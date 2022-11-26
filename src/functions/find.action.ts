'use strict';

import {each, first} from 'lodash';
import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import ActionAsCommandInterface from '../interfaces/action.as.command.interface';

export const findAction = (root: string, cliCommand: string): ActionAsCommandInterface => {
	const actionPaths: string[] = listSubfoldersFilesByFolderName(root, 'actions');

	let action: ActionAsCommandInterface;

	each(actionPaths, (actionPath: string) => {
		// tslint:disable-next-line:callable-types
		const ActionClass: {new (): ActionAsCommandInterface} = require(actionPath).default;
		const actionInstance = new ActionClass();
		const actionCommand = first(actionInstance.signature().split(' '));

		if (cliCommand === actionCommand) {
			action = actionInstance;
			return false;
		}
	});

	return action;
};
export default findAction;
