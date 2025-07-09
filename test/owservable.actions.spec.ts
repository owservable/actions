'use strict';

import * as OwservableActions from '../src/owservable.actions';

describe('owservable.actions tests', () => {
	it('OwservableActions', () => {
		expect(OwservableActions).toBeDefined();
	});

	it('OwservableActions::findCommandAction:', () => {
		expect(OwservableActions.findCommandAction).toBeDefined();
		expect(typeof OwservableActions.findCommandAction).toBe('function');
	});

	it('OwservableActions::runActionAsCommand:', () => {
		expect(OwservableActions.runActionAsCommand).toBeDefined();
		expect(typeof OwservableActions.runActionAsCommand).toBe('function');
	});

	it('OwservableActions::getOptionAndDefaultValue:', () => {
		expect(OwservableActions.getOptionAndDefaultValue).toBeDefined();
		expect(typeof OwservableActions.getOptionAndDefaultValue).toBe('function');
	});

	it('OwservableActions::Action:', () => {
		expect(OwservableActions.Action).toBeDefined();
		expect(typeof OwservableActions.Action).toBe('function');
	});

	it('OwservableActions::default', () => {
		expect(OwservableActions.default).toBeDefined();
		expect(Object.keys(OwservableActions.default)).toHaveLength(0);
		expect(OwservableActions.default).toEqual({});
	});
});
