const messages = require('elasticio-node').messages;


exports.process = processTrigger;

function processTrigger(msg) {
    const self = this;
    const events = JSON.parse(msg.body.mandrill_events);

    events.forEach((it) => {
        const msg = messages.newMessageWithBody(it);

        self.emit('data', msg);
    });

    self.emit('end');
}