"use strict";

const mandrill = require('../mandrill.js');
const _ = require('lodash');
const messages = require('elasticio-node').messages;
const schemaIn = require('../schemas/sendTemplate.in.json');
const schemaOut = require('../schemas/sendTemplate.out.json');

const TAGS_REGEX = /\*\|([A-Za-z_]+)\|\*/g;


exports.process = processAction;
exports.getTemplateModel = getTemplateModel;
exports.getMetaModel = getMetaModel;

function processAction(msg, cfg) {

    const client = mandrill.createClient(cfg);

    const params = createParams(msg, cfg);

    console.log("%j",params)

    return new Promise((resolve, reject) => {
        client.messages.sendTemplate(params, resolve, reject);
    })
        .then((result) => messages.newMessageWithBody(result));
}

function createParams(msg, cfg) {
    const templateName = cfg.templateName;
    const  message = msg.body.message;
    return  {
        template_name: templateName,
        template_content: [],
        message: message
    };
}

function getTemplateModel(cfg) {
    const client = mandrill.createClient(cfg);

    return new Promise((resolve, reject) => {
        client.templates.list({}, resolve, reject);
    }).then((result) => {
        const model = {};

        result.forEach((it) => {
            model[it.name] = it.name;
        });

        return model;
    });
}

function getMetaModel(cfg) {
    const client = mandrill.createClient(cfg);

    const filter = {
        name: cfg.template
    };

    return new Promise((resolve, reject) => {
        client.templates.info(filter, resolve, reject);
    })
        .then(parseTags)
        .then(extendMetadata);

    function parseTags(template) {
        let tags = [];
        const tagsArr = template.publish_code.match(TAGS_REGEX);

        if (tagsArr && tagsArr.length) {
            tags = tagsArr.map(_createMetaFieldFromTag);
        }

        return tags;
    }

    function _createMetaFieldFromTag(tag) {
        const result = {};

        const tagName = tag
            .replace('*|', '')
            .replace('|*', '')
            .toLowerCase();

        result[tagName] = {
            type: 'string',
            required: false,
            title: tag
        };

        return result;
    }

    function extendMetadata(mergeVars) {
        const schemaInCopy = _.cloneDeep(schemaIn);
        const mappedMergeVars = {
            type: 'object',
            properties: {}
        };

        schemaInCopy.properties.mapped_merge_vars = mappedMergeVars;

        _.extend.apply(_, [mappedMergeVars.properties].concat(mergeVars));

        return {
            in: schemaInCopy,
            out: schemaOut
        };
    }
}