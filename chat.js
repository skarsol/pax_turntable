DoChatCommand = function(text) {
	if(text == 'Begin DJ')
	{
		bot.addDj();
		return("Starting to DJ!");
	}
	else if(text == 'Stop DJ')
	{
		bot.remDj();
		return("Not gonna DJ no mo'!");
	}
	else if(text == "Auth User")
	{
		console.log("Adding user "+ command[2] + " by " + nick);
		var tempUsers = nconf.get('authUsers');
		tempUsers.push(command[2]);
		nconf.set('authUsers', tempUsers);
		return("Added " + command[2] + " to the Authorized Users list.")
	}
	else if(text == "Deauth User")
	{
		console.log("Removing user "+ command[2] + " by " + nick);
		var tempUsers = nconf.get('authUsers');
		var remUser = tempUsers.indexOf(command[2]);
		tempUsers.splice(remUser,1);
		nconf.set('authUsers', tempUsers);
		return("Removed " + command[2] + " from the Authorized Users list.");
	}
	else if(text == "User List")
	{
		return(nick,nconf.get('authUsers').join());
	}
	else if(text == "Mute")
	{
		nconf.set('verbose',false);
		return("Muted");
	}
	else if(text == "Unmute")
	{
		nconf.set('verbose',true);
		return("Unmuted");
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
					return(str);
				});
			}
		}
	}
};