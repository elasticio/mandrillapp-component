/*eslint no-invalid-this: 0 no-console: 0*/
'use strict';
const messages = require('elasticio-node').messages;
const mandrill = require('mandrill-api/mandrill');

function startup(cfg) {
    console.log('Executing startup');
    return new Promise((ok,nok) => {
        if (!cfg.apiKey) {
            return nok('apiKey is missing in configuration');
        }
        const client = new mandrill.Mandrill(cfg.apiKey);
        const myHookURL = process.env.ELASTICIO_FLOW_WEBHOOK_URI;
        console.log('Adding a new route domain=%s pattern=%s', cfg.domain, cfg.pattern);
        console.log('My webhook URL is %s', myHookURL);
        client.inbound.addRoute({
            domain: cfg.domain,
            pattern: cfg.pattern,
            url: myHookURL
        }, ok, nok);
    });
}

function processTrigger(msg = {}) {
    const that = this;
    return new Promise((resolve, reject) => {
        if (msg.body && msg.body.mandrill_events) {
            const events = JSON.parse(msg.body.mandrill_events);
            console.log('Got %s events', events.length);
            events.forEach((it) => that.emit('data', messages.newMessageWithBody(it)));
            resolve();
        } else {
            console.log('Can not find mandrill_events, message=%j', msg);
            reject('Message with mandrill_events is expected but not found');
        }
    });
}

function shutdown(cfg, startData) {
    console.log('Executing shutdown startData=%j', startData);
    return new Promise((ok,nok) => {
        if (!startData.id) {
            return nok('ID of the mandrillapp hook wa not found in startupData');
        }
        if (!cfg.apiKey) {
            return nok('apiKey is missing in configuration');
        }
        const client = new mandrill.Mandrill(cfg.apiKey);
        client.inbound.deleteRoute({
            id: startData.id
        }, ok, nok);
    });
}

exports.process = processTrigger;
exports.startup = startup;
exports.shutdown = shutdown;
