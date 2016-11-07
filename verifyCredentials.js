"use strict";
const client = require('./lib/client.js');

module.exports = verify;

function verify(credentials) {
    console.log('About to verify given API key by retrieving user from Mandrill');

    const client = client.create(credentials);

    return new Promise((resolve, reject) => {
        client.users.info({}, resolve, reject);
    }).then((result) => {
        console.log('Your username: %s. API key is valid.', result.username);
        return result;
    });
}