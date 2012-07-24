// Set the config options. Should load/save this from/to a file.
config = new Object();

// General bot config
config.authUsers = new Array("Bob","Jane");
config.verbose = true;

// IRC config
config.ircroom = '#your_irc_server';
config.ircserver = 'irc.irc.org';
config.ircuser = 'bot_name';

// Database config
config.mysqluser = 'db_user';
config.mysqldatabase = 'database';
config.mysqlpassword = 'db_pass';
config.mysqlsocket = '/var/run/mysqld/mysqld.sock';

// Turntable config
config.AUTH = 'auth+live+XXXXXXXXXXXXXXXXXXXXXX';
config.USERID = 'YYYYYYYYYYYYYYYYYYYYYYYY';
config.ROOMID = 'ZZZZZZZZZZZZZZZZZZZZZZZZ';

// Load IRC module, create client as a global
var irc = require('irc');
client = new irc.Client(config.ircserver, config.ircuser, {
	channel: [config.ircroom],
});
// Connect to our IRC channel once the server gives us the OK
client.on('registered', function() {
	client.join(config.ircroom);
});

// Load mysql module, create connection as a global
var mysql = require('mysql');
connection = mysql.createConnection({
	socketPath: config.mysqlsocket,
	user : config.mysqluser,
	database : config.mysqldatabase,
	password: config.mysqlpassword
});
connection.connect();

// Load the ttapi module, create the bot as a global
var Bot = require('ttapi');
bot = new Bot(config.AUTH, config.USERID, config.ROOMID);

require('./functions.js');

bot.on('newsong', OnNewsong); 
bot.on('endsong', OnEndsong); 
bot.on('add_dj', OnAddDJ); 
bot.on('rem_dj', OnRemDJ); 
bot.on('nosong', OnNosong); 

client.on('pm', OnIRCChat);