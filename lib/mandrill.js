const mandrill = require('mandrill-api/mandrill');

function createClient(cfg) {

    const apiKey = cfg.apiKey;

    if (!apiKey) {
        throw new Error('API key is missing');
    }

    return new mandrill.Mandrill(apiKey);
}

exports.createClient = createClient;
