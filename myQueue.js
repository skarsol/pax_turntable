RemLastSongFromQueue = function() {
	bot.playlistAll(function(data){
					var songList = data.list;
					var len = songList.length;
					bot.playlistRemove(len - 1);
				});
}

AddRandomSong = function() {
	var str = "select songid from songs where id in (SELECT distinct(id) FROM `plays` where upvotes > 0)  and lastHeard < date_sub(now(), interval 1 day) ORDER BY rand() LIMIT 1";
	//console.log("Query: "+ str);
	connection.query(str, function(err,rows) {
		var songid = rows[0].songid;
		bot.playlistAdd(songid, function() {
					//bot.playlistAll(function(data){console.log(data);});
				});
	});
}