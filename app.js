	
var express   = require('express'),
    builder   = require('botbuilder'),
    connector = require('botbuilder-wechat-connector');

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
    	session.send("Im a wechat bot!");
    }
]);

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