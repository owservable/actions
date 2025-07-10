'use strict';

import {listSubfoldersFilesByFolderName} from '@owservable/folders';

import ActionAsCommandInterface from '../interfaces/action.as.command.interface';

export const findCommandAction: Function = async (root: string, cliCommand: string): Promise<ActionAsCommandInterface | null> => {
	const actionPaths: string[] = await listSubfoldersFilesByFolderName(root, 'actions');

	for (const actionPath of actionPaths) {
		try {
			const ActionClass: new () => ActionAsCommandInterface = require(actionPath).default;
			if (!ActionClass) continue;

			const actionInstance: ActionAsCommandInterface = new ActionClass();

			// Add signature validation
			const signature: string | undefined = actionInstance.signature();
			if (!signature || typeof signature !== 'string') continue;

			// Parse command from signature with validation
			const signatureParts: string[] = signature.trim().split(/\s+/);
			const actionCommand: string = signatureParts[0];
			if (!actionCommand || actionCommand.length === 0) continue;

			if (cliCommand === actionCommand) return actionInstance;
		} catch (error) {
			// Skip malformed or problematic action files, continue searching
			console.warn(`[@owservable/actions] Failed to process action ${actionPath}:`, error instanceof Error ? error.message : error);
		}
	}

	return null;
};
export default findCommandAction;
