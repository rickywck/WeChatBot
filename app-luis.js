/**
 LUIS version
 */

var restify = require('restify');
var builder = require('botbuilder');

require('dotenv').config({silent: true});

// Setup some https server options
var fs = require('fs');
var https_options = {
    ca:  fs.readFileSync('/home/bitnami/COMODO_DV_SHA-256_bundle.crt.zip'),
    key: fs.readFileSync('/home/bitnami/rickywck_mooo_com.key'),
    certificate: fs.readFileSync('/home/bitnami/rickywck_mooo_com.crt')
  };

var contexts;

// Setup Restify Server
var server = restify.createServer(https_options);
server.listen(process.env.port || process.env.PORT || 443, function () {
   console.log('%s listening to %s', server.name, server.url); 
});


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.appId,
    appPassword: process.env.appPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Hello', function (session) {
    session.send('Hi, how can I help you?');
}).triggerAction({
    matches: 'Hello'
});

bot.dialog('get-name', function (session, args) {
    // retrieve hotel name from matched entities
    var userNameEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'user-name');
    if (userNameEntity) {
        session.send('Nice to know you \'%s\'...', userNameEntity.entity);
    }
}).triggerAction({
    matches: 'get-name'
});