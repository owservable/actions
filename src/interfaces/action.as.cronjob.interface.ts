'use strict';

import ActionInterface from './action.interface';

export default interface ActionAsCronjobInterface extends ActionInterface {
	schedule(): string;

	asCronjob(): Promise<void>;

	asCronjobInit?(): Promise<void>;

	cronjobOptions?(): string;
}

// Documentation: https://www.npmjs.com/package/node-cron

/** Schedule:
 * 					# ┌────────────── second (optional)
 * 					# │ ┌──────────── minute
 * 					# │ │ ┌────────── hour
 * 					# │ │ │ ┌──────── day of month
 * 					# │ │ │ │ ┌────── month
 * 					# │ │ │ │ │ ┌──── day of week
 * 					# │ │ │ │ │ │
 * 					# │ │ │ │ │ │
 * 					# * * * * * *
 */

/** Options:
 * 		scheduled: boolean	- default: true
 * 		timezone: string	- see https://www.iana.org/time-zones for valid values, such as Asia/Shanghai, Asia/Kolkata, America/Sao_Paulo...
 */
