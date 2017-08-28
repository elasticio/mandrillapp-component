const messages = require('elasticio-node').messages;

exports.process = processTrigger;

function processTrigger(msg = {}) {
    return new Promise((resolve, reject) => {
        if (msg.body && msg.body.mandrill_events) {
            const events = JSON.parse(msg.body.mandrill_events);
            console.log('Got %s events', events.length);
            events.forEach((it) => this.emit('data', messages.newMessageWithBody(it)));
            resolve();
        } else {
            console.log('Can not find mandrill_events, message=%j', msg);
            reject('Message with mandrill_events is expected but not found');
        }
    });
}
