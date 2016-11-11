"use strict";

const mandrill = require('../mandrill.js');
const _ = require('lodash');
const messages = require('elasticio-node').messages;
const schemaIn = require('../schemas/sendTemplate.in.json');
const schemaOut = require('../schemas/sendTemplate.out.json');

const MERGE_VARS_REGEX = /\*\|([A-Za-z_]+)\|\*/g;

const toBool = [
    'async',
    'important',
    'track_opens',
    'track_clicks',
    'auto_text',
    'auto_html',
    'inline_css',
    'url_strip_qs',
    'preserve_recipients',
    'view_content_link'
];

const toArrayOfStrings = [
    'tags',
    'google_analytics_domains'
];

const toJSONObject = [
    'metadata'
];


exports.process = processAction;
exports.getTemplateModel = getTemplateModel;
exports.getMetaModel = getMetaModel;
exports.createParams = createParams;

function processAction(msg, cfg) {

    const client = mandrill.createClient(cfg);

    const params = createParams(msg, cfg);

    console.log("%j", params);

    return new Promise((resolve, reject) => {
        client.messages.sendTemplate(params, resolve, reject);
    })
        .then(checkResult)
        .then((result) => messages.newMessageWithBody(result));
}

function createParams(msg, cfg) {
    const body = msg.body;
    const templateName = cfg.templateName;
    const message = body.message;

    console.log('About ot send a new transactional message through Mandrill using a template:', templateName);

    toBool.forEach(_convertToBoolean.bind(null, message));
    toArrayOfStrings.forEach(_splitToArrayOfStrings.bind(null, message));
    toJSONObject.forEach(_toJSONObject.bind(null, message));

    message.global_merge_vars = _getMergeVars(body.mapped_merge_vars);

    if (message.global_merge_vars) {
        console.log('%s global_merge_vars used', message.global_merge_vars);
    }

    delete message.ip_pool;
    delete message.async;
    delete message.template_name;
    delete message.mapped_merge_vars;

    return {
        template_name: templateName,
        template_content: [],
        message: message,
        async: !!message.async,
        ip_pool: message.ip_pool
    };
}

function checkResult(response) {
    if (!response.length){
        return null;
    }

    const result = response[0];

    console.log('Sending status:', result.status);

    if (result.status === 'rejected' || result.status === 'invalid') {
        throw new Error(JSON.stringify(result));
    }

    return result;
}

function getTemplateModel(cfg) {
    console.log('About to retrieve available templates');

    const client = mandrill.createClient(cfg);

    return new Promise((resolve, reject) => {
        client.templates.list({}, resolve, reject);
    }).then((result) => {
        const model = {};

        result.forEach((it) => {
            model[it.name] = it.name;
        });
        console.log('Found %s templates', result.length);

        return model;
    });
}

function getMetaModel(cfg) {
    const client = mandrill.createClient(cfg);
    const templateName = cfg.templateName;
    console.log('About to retrieve info about template:', templateName);

    const filter = {
        name: templateName
    };

    return new Promise((resolve, reject) => {
        client.templates.info(filter, resolve, reject);
    })
        .then(parseMergeVars)
        .then(extendMetadata);

    function parseMergeVars(template) {
        let tags = [];
        const tagsArr = template.publish_code.match(MERGE_VARS_REGEX);

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

function _getMergeVars(rawVars) {
    const mappedMergeVars = [];

    for (var prop in rawVars) {
        if (!rawVars[prop]) {
            continue;
        }
        mappedMergeVars.push({
            name: prop,
            content: rawVars[prop]
        });
    }

    return mappedMergeVars;
}

function _convertToBoolean(obj, prop) {
    obj[prop] = (obj[prop] === 'Yes');
}

function _splitToArrayOfStrings(obj, prop) {
    if (!obj[prop]) {
        return;
    }
    const arr = String(obj[prop]).split(',');
    if (arr.length) {
        obj[prop] = arr.map(_trim).filter(Boolean);
    }
}

function _toJSONObject(obj, prop) {
    const value = obj[prop];

    if (!value) {
        return;
    }
    if (typeof value === 'object') {
        return;
    }

    obj[prop] = JSON.parse(value);
}

function _trim(elem) {
    return elem.trim();
}