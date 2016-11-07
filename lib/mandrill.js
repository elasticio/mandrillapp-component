"use strict";
const mandrill = require('mandrill-api/mandrill');

exports.createClient = createClient;

function createClient(cfg) {

    const apiKey = cfg.apiKey;

    if (!apiKey) {
        throw new Error('API key is missing');
    }

    return new mandrill.Mandrill(apiKey);
}