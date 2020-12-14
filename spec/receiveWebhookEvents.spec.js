'use strict';
const logger = require('@elastic.io/component-logger')();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const trigger = require('../lib/triggers/receiveWebhookEvents');
const { messages } = require('elasticio-node');

const EventEmitter = require('events');

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

class TestEmitter extends EventEmitter {

    constructor(done) {
        super();
        this.data = [];
        this.end = 0;
        this.error = [];

        this.on('data', (value) => this.data.push(value));
        this.on('error', (value) => {
            this.error.push(value);
            console.error(value.stack || value);
        });
        this.on('end', () => {
            this.end++;
            done();
        });
    }

}


describe('Given trigger function', () => {

    it('should process events', () => {
        const message = require('./data/other.sample.json');
        const emitter = new TestEmitter();
        emitter.logger = logger;
        return trigger.process.call(emitter, message).then(() => {
            expect(emitter.data.length).to.be.equal(1);
        });
    });

    it('should report error if mandrill_events is not found', () => {
        const message = messages.newMessageWithBody({
            foo: 123
        });
        const emitter = new TestEmitter();
        emitter.logger = logger;
        return assert.isRejected(trigger.process.call(emitter, message));
    });

});
