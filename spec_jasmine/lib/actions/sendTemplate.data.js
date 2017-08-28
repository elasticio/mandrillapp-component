module.exports = {
    template: {
        publish_code: 'Sobaka kot\r\nhello *|USERNAME|*!\r\n\r\nsome other *|MERGEDATA|*'
    },
    expectMeta: {
        username: {
            type: 'string',
            required: false,
            title: '*|USERNAME|*'
        },
        mergedata: {
            type: 'string',
            required: false,
            title: '*|MERGEDATA|*'
        }
    },
    incomeMsgNew: {
        body: {
            message: {
                "url_strip_qs": "Yes",
                "view_content_link": "No",
                "track_opens": "Yes",
                "track_clicks": "Yes",
                "preserve_recipients": "No",
                "inline_css": "No",
                "important": "No",
                "auto_text": "Yes",
                "auto_html": "Yes",
                "subject": "testing",
                "from_name": "artem",
                "from_email": "asci@yandex.ru",
                "tags": "welcome, intro",
                "google_analytics_domains": "elastic.io",
                "google_analytics_campaign": "TransactionalEmail",
                "to": [
                    {
                        "type": "to",
                        "name": "kzname",
                        "email": "some@awesome.kz"
                    }
                ],
                "async": true
            },
            "mapped_merge_vars": {
                username: 'super',
                data: 'super-data'
            },
        }
    },
    incomeMsgNewWoGlobal: {
        body: {
            message : {
                "url_strip_qs": "Yes",
                "view_content_link": "No",
                "track_opens": "Yes",
                "track_clicks": "Yes",
                "preserve_recipients": "No",
                "inline_css": "No",
                "important": "No",
                "auto_text": "Yes",
                "auto_html": "Yes",
                "subject": "testing",
                "from_name": "artem",
                "from_email": "asci@yandex.ru",
                "google_analytics_domains": "elastic.io,somedomain,,",
                "google_analytics_campaign": "TransactionalEmail",
                "tags": "",
                "to": [
                    {
                        "type": "to",
                        "name": "kzname",
                        "email": "some@awesome.kz"
                    }
                ],
                "async": true
            }
        }
    },
    incomeMsgWithMetadata: {
        body: {
            message: {
                "url_strip_qs": "Yes",
                "view_content_link": "No",
                "track_opens": "Yes",
                "track_clicks": "Yes",
                "preserve_recipients": "No",
                "inline_css": "No",
                "important": "No",
                "auto_text": "Yes",
                "auto_html": "Yes",
                "subject": "testing",
                "from_name": "artem",
                "from_email": "asci@yandex.ru",
                "tags": "welcome, intro",
                "google_analytics_domains": "elastic.io",
                "google_analytics_campaign": "TransactionalEmail",
                "to": [
                    {
                        "type": "to",
                        "name": "kzname",
                        "email": "some@awesome.kz"
                    }
                ],
                "async": true,
                "metadata": "{\"name\" : \"Homer Simpson\", \"color\":\"yellow\"}"
            },
            "mapped_merge_vars": {
                username: 'super',
                data: 'super-data'
            },
        }
    },
    processedMessageWoGlobal: {
        "template_name": "sobaka",
        "message": {
            "url_strip_qs": true,
            "view_content_link": false,
            "track_opens": true,
            "track_clicks": true,
            "preserve_recipients": false,
            "inline_css": false,
            "important": false,
            "auto_text": true,
            "auto_html": true,
            "subject": "testing",
            "from_name": "artem",
            "from_email": "asci@yandex.ru",
            "google_analytics_domains": [
                "elastic.io",
                "somedomain"
            ],
            "google_analytics_campaign": "TransactionalEmail",
            "tags": "",
            "to": [
                {
                    "type": "to",
                    "name": "kzname",
                    "email": "some@awesome.kz"
                }
            ],
            "global_merge_vars": []
        },
        "async": false
    },
    processedMessage: {
        "template_name": "sobaka",
        "message": {
            "url_strip_qs": true,
            "view_content_link": false,
            "track_opens": true,
            "track_clicks": true,
            "preserve_recipients": false,
            "inline_css": false,
            "important": false,
            "auto_text": true,
            "auto_html": true,
            "subject": "testing",
            "from_name": "artem",
            "from_email": "asci@yandex.ru",
            "tags": [
                "welcome",
                "intro"
            ],
            "google_analytics_domains": [
                "elastic.io"
            ],
            "google_analytics_campaign": "TransactionalEmail",
            "to": [
                {
                    "type": "to",
                    "name": "kzname",
                    "email": "some@awesome.kz"
                }
            ],
            "global_merge_vars": [
                {
                    "name": "username",
                    "content": "super"
                },
                {
                    "name": "data",
                    "content": "super-data"
                }
            ]
        }
    },
    processedMessageWithMetadata: {
        "template_name": "sobaka",
        "message": {
            "url_strip_qs": true,
            "view_content_link": false,
            "track_opens": true,
            "track_clicks": true,
            "preserve_recipients": false,
            "inline_css": false,
            "important": false,
            "auto_text": true,
            "auto_html": true,
            "subject": "testing",
            "from_name": "artem",
            "from_email": "asci@yandex.ru",
            "tags": [
                "welcome",
                "intro"
            ],
            "google_analytics_domains": [
                "elastic.io"
            ],
            "google_analytics_campaign": "TransactionalEmail",
            "to": [
                {
                    "type": "to",
                    "name": "kzname",
                    "email": "some@awesome.kz"
                }
            ],
            "global_merge_vars": [
                {
                    "name": "username",
                    "content": "super"
                },
                {
                    "name": "data",
                    "content": "super-data"
                }
            ],
            metadata : {
                name : 'Homer Simpson',
                color : 'yellow'
            }
        }
    },
    errResp: {
        "status": "error",
        "code": -1,
        "name": "ValidationError",
        "message": "Boom"
    },
    goodResp: [{
        "email": "recipient.email@example.com",
        "status": "sent",
        "_id": "abc123abc123abc123abc123abc123"
    }],
    rejectedResponse: [{
        "email": "recipient.email@example.com",
        "status": "rejected",
        "reject_reason":"invalid-sender",
        "_id": "abc123abc123abc123abc123abc123"
    }]
};