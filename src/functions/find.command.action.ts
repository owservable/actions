'use strict';

import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import ActionAsCommandInterface from '../interfaces/action.as.command.interface';

export const findCommandAction: Function = async (root: string, cliCommand: string): Promise<ActionAsCommandInterface | null> => {
	const actionPaths: string[] = await listSubfoldersFilesByFolderName(root, 'actions');

	for (const actionPath of actionPaths) {
		const ActionClass: new () => ActionAsCommandInterface = require(actionPath).default;
		if (!ActionClass) continue;

		const actionInstance: ActionAsCommandInterface = new ActionClass();

		// Add signature validation
		const signature: string | undefined = actionInstance.signature();
		if (!signature || typeof signature !== 'string') continue;

		// Parse command from signature with validation
		const signatureParts: string[] = signature.trim().split(/\s+/);
		const actionCommand: string = signatureParts[0];

		if (cliCommand === actionCommand) return actionInstance;
	}

	return null; // Explicitly return null when not found
};
export default findCommandAction;
