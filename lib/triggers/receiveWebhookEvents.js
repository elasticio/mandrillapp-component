const messages = require('elasticio-node').messages;


exports.process = processTrigger;

function processTrigger(msg) {
    const self = this;
    const body = msg.body;

    body.forEach((it) => {
        const msg = messages.newMessageWithBody(it);

        self.emit('data', msg);
    });

    self.emit('end');
}