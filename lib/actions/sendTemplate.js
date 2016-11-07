"use strict";

const mandrill = require('./lib/mandrill.js');
const messages = require('elasticio-node').messages;


exports.process = processAction;
exports.getTemplateModel = getTemplateModel;

function processAction(msg, cfg) {

    const client = mandrill.createClient(cfg);

    const message = {
        from_email: 'noreply@elastic.io',
        from_name: 'Foo',
        track_opens: true,
        async: false
    };

    const options = {
        template_name: cfg.templateName,
        template_content: [],
        message: message
    };

    return new Promise((resolve, reject) => {
        client.messages.sendTemplate(options, resolve, reject);
    })
        .then((result) => messages.newMessageWithBody(result));
}

function getTemplateModel(cfg) {
    const client = mandrill.createClient(cfg);

    return new Promise((resolve, reject) => {
        client.templates.list({}, resolve, reject);
    }).then((result) => {
        const model = {};

        result.forEach((it) => {
            model[it.slug] = it.name;
        });

        return model;
    });
}