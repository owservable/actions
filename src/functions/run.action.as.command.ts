'use strict';

import {Command} from 'commander';
import {each, first} from 'lodash';

import ActionAsCommandInterface from '../interfaces/action.as.command.interface';
import getOptionAndDefaultValue from '../functions/get.option.and.default.value';

export const runActionAsCommand = async (action: ActionAsCommandInterface): Promise<void> => {
	const program: Command = new Command();
	const signature: string = action.signature();
	const actionCommand: string = first(signature.split(' '));

	program
		.name('pnpm cli') //
		.command(actionCommand)
		.description(action.description());

	const options: string[] = signature.match(/{([^}]*)}/g);
	each(options, (config) => {
		const {option, defaultValue} = getOptionAndDefaultValue(config);
		program.option(option, '', defaultValue);
	});

	program.parse(process.argv);

	return action.asCommand(program.opts());
};
export default runActionAsCommand;
