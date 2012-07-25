DoChatCommand = function(nick, text, cb) {
	var str = "I did nothing!";
	
	if(text == 'Begin DJ')
	{
		bot.addDj();
		str = "Starting to DJ!";
	}
	else if(text == 'Stop DJ')
	{
		bot.remDj();
		str = "Not gonna DJ no mo'!";
	}
	else if(text == 'Add Song')
	{
		AddRandomSong();
		str = "Adding a song.";
	}
	else if(text == 'Rem Song')
	{
		RemLastSongFromQueue();
		str = "Removing a song.";
	}
	else if(text == "Auth User")
	{
		console.log("Adding user "+ command[2] + " by " + nick);
		var tempUsers = nconf.get('authUsers');
		tempUsers.push(command[2]);
		nconf.set('authUsers', tempUsers);
		str = "Added " + command[2] + " to the Authorized Users list.";
	}
	else if(text == "Deauth User")
	{
		console.log("Removing user "+ command[2] + " by " + nick);
		var tempUsers = nconf.get('authUsers');
		var remUser = tempUsers.indexOf(command[2]);
		tempUsers.splice(remUser,1);
		nconf.set('authUsers', tempUsers);
		str = "Removed " + command[2] + " from the Authorized Users list.";
	}
	else if(text == "User List")
	{
		str = nconf.get('authUsers').join();
	}
	else if(text == "Mute")
	{
		nconf.set('verbose',false);
		str = "Muted";
	}
	else if(text == "Unmute")
	{
		nconf.set('verbose',true);
		str = "Unmuted";
	}
	else if(text == "List Queue")
	{
		bot.playlistAll(function(data){
			var songList = data.list;
			str = "";
			songList.forEach(function(song, index) {
				var thisSong = song._id;
				var songName = song.metadata.song;
				str += '['+index+'] '+ songName;
			});
			cb(nick,str);
			return;
		});
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
			
		}
	}
	cb(nick,str);
};