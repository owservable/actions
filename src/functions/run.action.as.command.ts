'use strict';

import {Command} from 'commander';

import ActionAsCommandInterface from '../interfaces/action.as.command.interface';
import getOptionAndDefaultValue from '../functions/get.option.and.default.value';

export const runActionAsCommand: Function = async (action: ActionAsCommandInterface): Promise<void> => {
	const program: Command = new Command();
	const signature: string = action.signature();
	const actionCommand: string = signature.split(' ')[0];

	program
		.name('pnpm cli') //
		.command(actionCommand)
		.description(action.description());

	const options: string[] | null = signature.match(/{([^}]*)}/g);
	if (options) {
		options.forEach((config: string): void => {
			const {option, defaultValue}: {option: string; defaultValue: string | undefined} = getOptionAndDefaultValue(config);
			program.option(option, '', defaultValue);
		});
	}

	program.parse(process.argv);

	return action.asCommand(program.opts());
};
export default runActionAsCommand;
