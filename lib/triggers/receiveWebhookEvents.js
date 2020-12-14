const logger = require('@elastic.io/component-logger')();
const { messages } = require('elasticio-node');
const mandrill = require('mandrill-api/mandrill');

function startup(cfg) {
    logger.info('Executing startup');
    return new Promise((ok,nok) => {
        if (!cfg.apiKey) {
            return nok('apiKey is missing in configuration');
        }
        const client = new mandrill.Mandrill(cfg.apiKey);
        const myHookURL = process.env.ELASTICIO_FLOW_WEBHOOK_URI;
        logger.info('Adding a new route...');
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
            that.logger.info('Got %s events', events.length);
            events.forEach((it) => that.emit('data', messages.newMessageWithBody(it)));
            resolve();
        } else {
            that.logger.error('Can not find mandrill_events!');
            reject('Message with mandrill_events is expected but not found');
        }
    });
}

function shutdown(cfg, startData) {
    logger.info('Executing shutdown...');
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
