// Get ready to load configuration information
nconf = require('nconf');
// Load any environment or command line arguments
nconf.env().argv();

// Load our config
nconf.file('./config.json');

// Load some defaults
nconf.defaults({
    'verbose': true
  });


// Load IRC module, create client as a global
var irc = require('irc');
client = new irc.Client(nconf.get('ircserver'), nconf.get('ircuser'), {
	channel: [nconf.get('ircroom')],
});
// Connect to our IRC channel once the server gives us the OK
client.on('registered', function() {
	client.join(nconf.get('ircroom'));
});

// Load mysql module, create connection as a global
var mysql = require('mysql');
connection = mysql.createConnection({
	socketPath: nconf.get('mysqlsocket'),
	user : nconf.get('mysqluser'),
	database : nconf.get('mysqldatabase'),
	password: nconf.get('mysqlpassword')
});
connection.connect();

// Load the ttapi module, create the bot as a global
var Bot = require('ttapi');
bot = new Bot(nconf.get('AUTH'), nconf.get('USERID'), nconf.get('ROOMID'));

require('./chat.js');
require('./functions.js');

bot.on('newsong', OnNewsong); 
bot.on('endsong', OnEndsong); 
bot.on('add_dj', OnAddDJ); 
bot.on('rem_dj', OnRemDJ); 
bot.on('nosong', OnNosong); 

client.on('pm', OnIRCChat);