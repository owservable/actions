'use strict';

import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import ActionAsCommandInterface from '../interfaces/action.as.command.interface';

export const findCommandAction = (root: string, cliCommand: string): ActionAsCommandInterface | null => {
	const actionPaths: string[] = listSubfoldersFilesByFolderName(root, 'actions');

	for (const actionPath of actionPaths) {
		try {
			const ActionClass: new () => ActionAsCommandInterface = require(actionPath).default;
			if (!ActionClass) continue;

			const actionInstance: ActionAsCommandInterface = new ActionClass();
			const actionCommand: string | undefined = actionInstance.signature()?.split(' ')[0];

			if (cliCommand === actionCommand) return actionInstance;
		} catch (error) {
			// Log error but continue searching - could be made configurable
			if (process.env.NODE_ENV !== 'test') {
				console.warn(`[@owservable/actions] Failed to load action from ${actionPath}:`, error instanceof Error ? error.message : error);
			}
		}
	}

	return null; // Explicitly return null when not found
};
export default findCommandAction;
