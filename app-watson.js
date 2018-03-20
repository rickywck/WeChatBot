	
var express   = require('express'),
    builder   = require('botbuilder'),
    connector = require('botbuilder-wechat-connector');
    
    var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

require('dotenv').config({silent: true});

var contexts;
var workspace=process.env.WORKSPACE_ID || '';

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});
console.log("process.env.WORKSPACE_ID "+ process.env.WORKSPACE_ID); 
console.log("process.env.appID "+ process.env.appId); 
console.log("process.env.appPassword "+ process.env.appPassword); 

// Create http server
var app    = express();

// Create wechat connector
var wechatConnector = new connector.WechatConnector({
    appID: "wxf317084254d69c25",
    appSecret: "5051ec05c3773a966631d6faeab7bcaa",
    appToken: "weixin"
});

var bot = new builder.UniversalBot(wechatConnector);

// Bot dialogs
bot.dialog('/', [
    function (session) {
//    	session.send("Im a wechat bot!");

//console.log("ID client "+ session.message.address.conversation.id);
console.log(JSON.stringify(session.message, null, 2));

    var payload = {
        workspace_id: workspace,
        context:'',
        input: { text: session.message.text}
    };

    var conversationContext = findOrCreateContext(session.message.address.conversation.id);	
    if (!conversationContext) conversationContext = {};
    payload.context = conversationContext.watsonContext;

    conversation.message(payload, function(err, response) {
     if (err) {
       session.send(err);
     } else {
       console.log(JSON.stringify(response, null, 2));
       session.send(response.output.text);
       conversationContext.watsonContext = response.context;
     }
    });
    }
]);

function findOrCreateContext (convId){
      // Let's see if we already have a session for the user convId
    if (!contexts)
        contexts = [];
        
    if (!contexts[convId]) {
        // No session found for user convId, let's create a new one
        //with Michelin concervsation workspace by default
        contexts[convId] = {workspaceId: workspace, watsonContext: {}};
        //console.log ("new session : " + convId);
    }
return contexts[convId];
}

//app.post('/bot/wechat', function (req, res) {
//	console.log('Message received: ' + req.message);
//  //res.send('POST request to homepage');
//});

app.use('/bot/wc', wechatConnector.listen());

app.get('*', function(req, res) {
    res.send(200, 'Hello Wechat Bot');
});

// Start listen on port
app.listen(process.env.port || 80, function() {
    console.log('server is running.');
});