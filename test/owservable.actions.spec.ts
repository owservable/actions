'use strict';

import {expect} from 'chai';

import * as OwservableActions from '../src/owservable.actions';

describe('owservable.actions tests', () => {
	it('OwservableActions', () => {
		expect(OwservableActions).to.exist;
	});

	it('OwservableActions::findCommandAction:', () => {
		expect(OwservableActions.findCommandAction).to.exist;
		expect(OwservableActions.findCommandAction).to.be.a('function');
	});

	it('OwservableActions::runActionAsCommand:', () => {
		expect(OwservableActions.runActionAsCommand).to.exist;
		expect(OwservableActions.runActionAsCommand).to.be.a('function');
	});

	it('OwservableActions::getOptionAndDefaultValue:', () => {
		expect(OwservableActions.getOptionAndDefaultValue).to.exist;
		expect(OwservableActions.getOptionAndDefaultValue).to.be.a('function');
	});

	it('OwservableActions::Action:', () => {
		expect(OwservableActions.Action).to.exist;
		expect(OwservableActions.Action).to.be.a('function');
	});

	it('OwservableActions::default', () => {
		expect(OwservableActions.default).to.exist;
		expect(OwservableActions.default).to.be.empty;
		expect(OwservableActions.default).to.deep.equal({});
	});
});
