const messages = require('elasticio-node').messages;

exports.process = processTrigger;

function processTrigger(msg) {
    return new Promise(() => {
        const events = JSON.parse(msg.body.mandrill_events);
        console.log('Got %s events', events.length);
        events.forEach((it) => this.emit('data', messages.newMessageWithBody(it)));
    }).bind(this);
}
