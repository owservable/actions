'use strict';

export default interface ActionInterface {
	description(): string;

	handle(...args: any[]): Promise<any>;
}
