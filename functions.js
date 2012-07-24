// Stopgap variables
var playerDBID = -1;
var songDBID = -1;

// Fires when a new DJ gets on the turntables.
// Does nothing currently.
OnAddDJ = function(data) {
	var playerName = data.user[0].name;
	var str = '\u0002' + playerName + '\u000F is now on the decks!';
	//client.say(config.ircroom,str);
};

// Fires when a DJ gets off the turntables.
// Does nothing currently.
OnRemDJ = function(data) {
	var playerName = data.user[0].name;
	var str = '\u0002' + playerName + '\u000F has given up!';
	//client.say(config.ircroom,str);
};

// Fires when there are no more DJs on the turntables.
OnNosong = function(data) {
	var str = '\u0002Oh noes! The room is dead!\u000F';
	if(config.verbose) client.say(config.ircroom,str);
};

// Fires when a song ends before the next song starts playing.
// We get up/downvote info here. Maybe switch to recording votes as they come in with update_votes and track who is voting?
OnEndsong = function(data) {
	var pid = playerDBID;
	playerDBID = -1;
	var sid = songDBID;
	songDBID = -1;
	var meta = data.room.metadata;
	var upvotes = meta.upvotes;
	var downvotes = meta.downvotes;
	var listeners = meta.listeners;

	if(pid == -1 || sid == -1) return;

	var str = "insert into plays (player,song,upvotes,downvotes,audience) values ("+pid+","+sid+","+upvotes+","+downvotes+","+listeners+")";
	connection.query(str);

};

// Fires when a new song starts playing.
OnNewsong = function(data) {
	var room = data.room.metadata;
	var song = room.current_song;
	var songID = song._id;
	var songTitle = song.metadata.song;
	var songArtist = song.metadata.artist;
	var songPlayer = room.current_dj;


	var str = "insert into songs (name,artist,songid) values (" + connection.escape(songTitle) + "," + connection.escape(songArtist)+ "," + connection.escape(songID) + ") on duplicate key update id=LAST_INSERT_ID(id), lastHeard = now()";
	//console.log("Query: "+ str);
	connection.query(str, function(err,rows) {
		songDBID = rows.insertId;
		//console.log('Song: ' + songDBID);
	});



	bot.getProfile(songPlayer,function(profile) {
		var playerName = profile.name;
		var str = '\u0002' + playerName + '\u000F is playing \u0002' + songTitle + '\u000F by \u0002' + songArtist + '\u000F';
		if(config.verbose) client.say(config.ircroom,str);

		connection.query("insert into djs (name,userid) values (" + connection.escape(playerName) + "," + connection.escape(songPlayer)+ ") on duplicate key update id=LAST_INSERT_ID(id), lastHeard = now()", function(err,rows) {
			playerDBID = rows.insertId;
			//console.log('DJ: ' + playerDBID);
		});

	});


};

// Fires when a PM is sent to the bot on IRC.
// Need to remove the logic to a generic function and then do auth checking on both IRC and TT chat that then passes to that generic function.
OnIRCChat = function(nick,text,message) {
	console.log(nick);
	console.log(text);
	if(config.authUsers.indexOf(nick) >=0)
	{
		if(text == 'Begin DJ')
		{
			bot.addDj();
		}
		else if(text == 'Stop DJ')
		{
			bot.remDj();
		}
		else
		{
			var command = text.match(/^([^:]*):?\s*(.*)/);
			if(command) {
				if(command[1] == "Add Song")
				{
				bot.playlistAdd(command[2], function() {
					bot.playlistAll(function(data){console.log(data);});
				});
				}
				else if (command[1] == "List Queue")
				{
					bot.playlistAll(function(data){
						var songList = data.list;
						var str = "Response: ";
						songList.forEach(function(song, index) {
							var thisSong = song._id;
							var songName = song.metadata.song;
							str += '['+index+'] '+ songName;
						});
						client.say(nick,str);
					
						
					});
				
				}
				else if(command[1] == "Auth User")
				{
					console.log("Adding user "+ command[2] + " by " + nick);
					config.authUsers.push(command[2]);
				}
				else if(command[1] == "Deauth User")
				{
					console.log("Removing user "+ command[2] + " by " + nick);
					var remUser = config.authUsers.indexOf(command[2]);
					config.authUsers.splice(remUser,1);
				}
				else if(command[1] == "User List")
				{
					client.say(nick,config.authUsers.join());
				}
				else if(command[1] == "Mute")
				{
					config.verbose = false;
				}
				else if(command[1] == "Unmute")
				{
					config.verbose = true;
				}
			}
		}

	}
};

