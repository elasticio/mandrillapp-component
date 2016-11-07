"use strict";
const mandrill = require('mandrill-api/mandrill');

exports.create = create;

function create(cfg) {

    const apiKey = cfg.apiKey;

    if (!apiKey) {
        throw new Error('API key is missing');
    }

    return new mandrill.Mandrill(apiKey);
}