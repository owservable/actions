'use strict';

export default abstract class Action {
	protected _signature: string = '';
	protected _description: string = '';
	protected _schedule: string = '';

	public signature(): string {
		return this._signature;
	}

	public description(): string {
		return this._description;
	}

	public schedule(): string {
		return this._schedule;
	}
}
