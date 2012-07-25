RemLastSongFromQueue = function() {
	bot.playlistAll(function(data){
					var songList = data.list;
					var len = songList.length;
					bot.playlistRemove(len - 1);
				});
}

AddRandomSong = function() {
	var str = "SELECT songid FROM `songs` WHERE id >= (SELECT FLOOR( MAX(id) * RAND()) FROM `songs` ) ORDER BY id LIMIT 1;";
	//console.log("Query: "+ str);
	connection.query(str, function(err,rows) {
		var songid = rows[0].songid;
		bot.playlistAdd(songid, function() {
					//bot.playlistAll(function(data){console.log(data);});
				});
	});
}