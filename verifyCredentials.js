"use strict";
const client = require('./lib/client.js');

module.exports = verify;

function verify(credentials) {

    const client = client.create(credentials);

    return new Promise((resolve, reject) => {
        return client.users.info({}, resolve, reject);
    });
}