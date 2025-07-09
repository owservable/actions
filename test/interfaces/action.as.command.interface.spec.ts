'use strict';

import {expect} from 'chai';

import * as ActionAsCommandInterface from '../../src/interfaces/action.as.command.interface';
import ActionAsCommandInterfaceType from '../../src/interfaces/action.as.command.interface';

// Mock implementation for testing
class MockCommandAction implements ActionAsCommandInterfaceType {
	signature(): string {
		return 'test-command {--option}';
	}

	description(): string {
		return 'Test command description';
	}

	async handle(...args: any[]): Promise<any> {
		return Promise.resolve(args);
	}

	async asCommand(options: any): Promise<void> {
		// Mock implementation
		return Promise.resolve();
	}
}

describe('action.as.command.interface tests', () => {
	it('ActionAsCommandInterface exists', () => {
		expect(ActionAsCommandInterface).to.exist;
		expect(ActionAsCommandInterface).to.be.an('object');
	});

	it('ActionAsCommandInterface can be implemented by a class', () => {
		const mockAction = new MockCommandAction();
		expect(mockAction).to.exist;
		expect(mockAction.signature).to.be.a('function');
		expect(mockAction.description).to.be.a('function');
		expect(mockAction.handle).to.be.a('function');
		expect(mockAction.asCommand).to.be.a('function');
	});

	it('ActionAsCommandInterface implementation has correct method signatures', () => {
		const mockAction = new MockCommandAction();

		// Test signature method
		expect(mockAction.signature()).to.be.a('string');
		expect(mockAction.signature()).to.equal('test-command {--option}');

		// Test description method
		expect(mockAction.description()).to.be.a('string');
		expect(mockAction.description()).to.equal('Test command description');

		// Test handle method
		expect(mockAction.handle()).to.be.a('promise');

		// Test asCommand method
		expect(mockAction.asCommand({})).to.be.a('promise');
	});

	it('ActionAsCommandInterface signature method returns string', () => {
		const mockAction = new MockCommandAction();
		const signature = mockAction.signature();
		expect(signature).to.be.a('string');
		expect(signature.length).to.be.greaterThan(0);
	});

	it('ActionAsCommandInterface asCommand method accepts options parameter', async () => {
		const mockAction = new MockCommandAction();
		const options = {verbose: true, output: 'test.txt'};

		// Should not throw when called with options
		expect(() => mockAction.asCommand(options)).to.not.throw();
	});

	it('ActionAsCommandInterface asCommand method returns Promise<void>', async () => {
		const mockAction = new MockCommandAction();
		const result = await mockAction.asCommand({});
		expect(result).to.be.undefined;
	});

	it('ActionAsCommandInterface extends ActionInterface', () => {
		const mockAction = new MockCommandAction();

		// Should have methods from ActionInterface
		expect(mockAction.description).to.be.a('function');
		expect(mockAction.handle).to.be.a('function');

		// Should have additional methods from ActionAsCommandInterface
		expect(mockAction.signature).to.be.a('function');
		expect(mockAction.asCommand).to.be.a('function');
	});
});
