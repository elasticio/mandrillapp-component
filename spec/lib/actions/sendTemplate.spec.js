describe('sendTemplate', function () {
    var sendTemplate = require('../../../lib/actions/sendTemplate.js');
    var action = sendTemplate.process;
    var createParams = sendTemplate.createParams;
    var getTemplateModel = sendTemplate.getTemplateModel;
    var getMetaModel = sendTemplate.getMetaModel;

    var nock = require('nock');
    var _ = require('lodash');
    var data = require('./sendTemplate.data.js');
    const cfg = {
        apiKey: 'secret'
    };

    describe('action', function () {
        it('should prepare message data for mapping without global vars', function () {
            var result = createParams(data.incomeMsgNewWoGlobal, {templateName: 'sobaka'});
            expect(result.message).toEqual(data.processedMessageWoGlobal.message);
            expect(result.template_name).toEqual(data.processedMessageWoGlobal.template_name);
            expect(result.async).toEqual(false);
        });

        it('should prepare message data', function () {
            var result = createParams(data.incomeMsgNew, {templateName: 'sobaka'});
            expect(result.message).toEqual(data.processedMessage.message);
            expect(result.template_name).toEqual(data.processedMessage.template_name);
            expect(result.async).toEqual(false);
        });

        it('should prepare message data with metadata', function () {
            var result = createParams(data.incomeMsgWithMetadata, {templateName: 'sobaka'});
            expect(result.message).toEqual(data.processedMessageWithMetadata.message);
            expect(result.template_name).toEqual(data.processedMessageWithMetadata.template_name);
            expect(result.async).toEqual(false);
        });

        describe('func', function () {
            let self;
            let msg;

            beforeEach(function () {
                self = jasmine.createSpyObj('self', ['emit']);
                msg = {
                    body: {
                        message: data.incomeMsgNew
                    }
                };
            });

            it('should send message and emit data', function () {
                spyOn(sendTemplate, 'createParams').andReturn({});

                nock('https://mandrillapp.com:443')
                    .post('/api/1.0/messages/send-template.json')
                    .reply(200, data.goodResp);

                let result;

                runs(function () {
                    action.call(self, msg, cfg)
                        .then((it) => {
                            result = it;
                        });
                });

                waitsFor(function () {
                    return !!result;
                });

                runs(function () {
                    expect(result.body).toEqual(data.goodResp);
                });

            });
            it('should handle error response', function () {
                spyOn(sendTemplate, 'createParams').andReturn({});

                nock('https://mandrillapp.com:443')
                    .post('/api/1.0/messages/send-template.json')
                    .reply(500, data.errResp);

                let result;

                runs(function () {
                    action.call(self, msg, cfg)
                        .catch((e)=> {
                            result = e;
                        });
                });

                waitsFor(function () {
                    return !!result;
                });

                runs(function () {
                    expect(result).toEqual(data.errResp);
                });

            });

            it('should emit error if api key is missing', function () {

                let result;

                runs(function () {
                    new Promise((resolve, reject) => {
                        action.call(self, msg, {})
                            .then(resolve)
                            .catch(reject);
                    }).catch((e)=> {
                        result = e;
                    });
                });

                waitsFor(function () {
                    return !!result;
                });

                runs(function () {
                    expect(result.message).toEqual('API key is missing');
                });

            });
        });
    });

    describe('getMetaModel', function () {
        it('should return proper mapped metadata', function () {

            nock('https://mandrillapp.com:443')
                .post('/api/1.0/templates/info.json')
                .reply(200, data.template);

            let result;

            runs(function () {
                getMetaModel(cfg)
                    .then((model)=> {
                        result = model;
                    });
            });

            waitsFor(function () {
                return !!result;
            });

            runs(function () {
                expect(result['in'].properties.mapped_merge_vars.properties).toEqual(data.expectMeta);
            });
        });
    });

    describe('getTemplates', function () {
        it('should return list of names of templates', function () {

            nock('https://mandrillapp.com:443')
                .post('/api/1.0/templates/list.json')
                .reply(200, [{name: 'sobaka'}, {name: 'kot'}]);

            let result;

            runs(function () {
                getTemplateModel(cfg)
                    .then((templatesNames)=> {
                        result = templatesNames;
                    });
            });

            waitsFor(function () {
                return !!result;
            });

            runs(function () {
                expect(result).toEqual({ sobaka : 'sobaka', kot : 'kot' } );
            });

        });
    });

});