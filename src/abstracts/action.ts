'use strict';

export default abstract class Action {
	protected _signature = '';
	protected _description = '';
	protected _schedule = '';

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
