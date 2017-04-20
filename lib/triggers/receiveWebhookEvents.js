const mandrill = require('../mandrill.js');
const messages = require('elasticio-node').messages;

exports.startup = startup;
exports.shutdown = shutdown;
exports.process = processTrigger;

function startup(cfg) {
    const client = mandrill.createClient(cfg);

    const url = process.env.ELASTICIO_FLOW_WEBHOOK_URI;
    console.log('Subscribing webhook url:', url);

    const events = [
        "send",
        "open",
        "click"
    ];
    const description = `elastic.io integration flow ${process.env.ELASTICIO_FLOW_ID}`;

    const options = {
        url,
        description,
        events
    };

    return new Promise((resolve, reject) => {
        client.webhooks.add(options, resolve, reject);
    });
}

function shutdown(cfg, state) {
    const client = mandrill.createClient(cfg);
    const id = state.id;

    console.log('Deleting webhook (id=%s) from Mandrill', id);

    const options = {
        id
    };

    return new Promise((resolve, reject) => {
        client.webhooks.add(options, resolve, reject);
    });
}

function processTrigger(msg) {
    const self = this;
    const events = JSON.parse(msg.body.mandrill_events);

    console.log('Got %s events', events.length);

    events.forEach((it) => {
        console.log(it);
        const msg = messages.newMessageWithBody(it);

        self.emit('data', msg);
    });

    self.emit('end');
}