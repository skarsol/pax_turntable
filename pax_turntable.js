// Get ready to load configuration information
nconf = require('nconf');
// Load any environment or command line arguments
nconf.env().argv();

// Load our config
nconf.file('./config.json');

// Load some defaults
nconf.defaults({
    'verbose': true,
    'enforceQueue': false
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

// Declare our main variables
djQueue = [];

require('./chat.js');
require('./functions.js');

bot.on('newsong', OnNewsong); 
bot.on('endsong', OnEndsong); 
bot.on('add_dj', OnAddDJ); 
bot.on('rem_dj', OnRemDJ); 
bot.on('nosong', OnNosong);
bot.on('roomChanged', OnRoomChanged);
bot.on('registered', OnRegistered);
bot.on('deregistered', OnDeregistered);
bot.on('speak', OnSpeak);
bot.on('update_votes', OnUpdateVotes);
bot.on('booted_user', OnBootedUser);
bot.on('update_user', OnUpdateUser);
bot.on('new_moderator', OnNewModerator);
bot.on('rem_moderator', OnRemModerator);
bot.on('snagged', OnSnagged);
bot.on('pmmed', OnPM);

client.on('pm', OnIRCChat);