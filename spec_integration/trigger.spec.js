'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const trigger = require('../lib/triggers/receiveWebhookEvents');
const { messages } = require('elasticio-node');

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;
const rb = require('request-bin');


describe('Given integration test environment', () => {

    const apiKey = process.env.MANDRILL_API_KEY;
    const pattern = 'integration-test-' + new Date().getMilliseconds();
    const domain = 'm.elastic.io';
    let hookID;

    before(function () {
        if (!apiKey) {throw new Error('Please set MANDRILL_API_KEY env variable to proceed');}
        return rb.RequestBinClient.createBin().then((bin) => {
            process.env.ELASTICIO_FLOW_WEBHOOK_URI=`https://requestb.in/${bin.name}`
        });
    });

    it('startup should add a new inbound route', () => {
        return trigger.startup({apiKey,domain,pattern}).then((result) => {
            console.log('Done', result);
            assert.isOk(result.id);
            hookID = result.id;
        })
    }).timeout(5000);

    it('shutdown should remove created inbound route', () => {
        return trigger.shutdown({apiKey,domain,pattern}, {id: hookID}).then((result) => {
            console.log('Remove done', result);
            assert.isOk(result.id);
            assert.equal(result.id, hookID);
        })
    }).timeout(5000);

});
