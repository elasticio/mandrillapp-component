const mandrill = require('./lib/mandrill.js');

function verify(credentials) {
    const that = this;
    this.logger.info('About to verify given API key by retrieving user from Mandrill');

    const client = mandrill.createClient(credentials);

    return new Promise((resolve, reject) => {
        client.users.info({}, resolve, reject);
    }).then((result) => {
        that.logger.info('Your username: %s. API key is valid.');
        return result;
    });
}

module.exports = verify;
