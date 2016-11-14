const messages = require('elasticio-node').messages;


exports.process = processTrigger;

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