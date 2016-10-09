"use strict";

const amqp = require('seneca-amqp-transport');
const seneca = require('seneca')().use(amqp);
const ready = require('hello-common/ready');

/**
 * This is an action on this service.  It handles requests for any word.
 */
seneca.add('word:*', (request, respond) => {

    respond(null, {
        reverse: request.word.split('').reverse().join('')
    });
});

/**
 * Check if rabbitmq is ready before allowing this service to use it.
 */
ready({
    hostname: 'rabbitmq',
    port: 15672,
    path: '/api'
}, () => {

    seneca
        .listen({
            type: 'amqp',
            hostname: 'rabbitmq',
            port: 5672,
            username: 'guest',
            password: 'guest',
            pin: {service: 'service-reverse'} // this service
        });
    
});