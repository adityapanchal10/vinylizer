const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const ytpl = require("ytpl");
const spotifyToYT = require("spotify-to-yt");

let query, id, shuffle;
let flag = false;
let urllist = [];
let songlist = [];

async function play(msg, args) {
	const { guild, channel, member } = msg;
	id = msg.client.id.get(guild.id);
	if (!id) {
		msg.client.id.set(guild.id, 1);
		id = msg.client.id.get(guild.id);
	}
	shuffle = msg.client.shuffle.get(guild.id);
	if (!shuffle) {
		msg.client.shuffle.set(guild.id, false);
		shuffle = msg.client.shuffle.get(guild.id);
	}
	// console.log("S_id " + id);

	const voiceChannel = member.voice.channel;
	if (!voiceChannel)
		return channel.send("Need to be connected in a voice channel.");

	const perm = voiceChannel.permissionsFor(msg.client.user);
	if (!perm.has("CONNECT") || !perm.has("SPEAK"))
		return channel.send("You do not have necessary permissions.");

  if (!args)
    return channel.send("Please enter a valid song name or link.");

	const serverQueue = msg.client.queue.get(guild.id);
	const queue = msg.client.queue;

	const videoFinder = async (query) => {
		const videoResult = await ytSearch(query);
		return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
	};

	// console.log(args);

  var isSpot = await spotifyToYT.validateURL(args)
  var spotPlaylist = await spotifyToYT.isTrackOrPlaylist(args) === 'playlist' ? true : false;

	if (isPlaylist(args) || spotPlaylist) {
		var response, list;

    channel.send("Playlist url processing, please wait.")

    if(spotPlaylist) {
      console.log("Spotify playlist found.")
      try {
        response = await spotifyToYT.playListGet(args);
      }
      catch(err) {
        console.log(`${err.name}: ${err.message}`);
        return msg.channel.send(":/ Encountered a problem with the url: " +err.message);
      }
      // console.log(response);
      urllist = response.songs;
    }
    else {
  		console.log("Yt playlist url found.");
      try {
        response = await ytpl(args);
      }
      catch(err) {
        console.log(`${err.name}: ${err.message}`);
        return msg.channel.send(":/ Encountered a problem with the url: " +err.message);
      }
      list = response.items;
      list.forEach((element) => {
			  urllist.push(element.shortUrl);
		  });
    }
	  
    // console.log(urllist);

		for (let item of urllist) {
			try {
        const songInfo = await ytdl.getInfo(item);
			  var song = {
				  id: id,
				  title: songInfo.videoDetails.title,
				  url: songInfo.videoDetails.video_url,
			  };
			  songlist.push(song);
			  id++;
      }
      catch(err){
        console.log(`${err.name}: ${err.message}`);
        return msg.channel.send(":/ Encountered a problem with the song:" +err.message);
      }
		}

		console.log("Songs retrieved and pushed successfully.");
		// console.log(songlist);
		msg.client.id.set(guild.id, id);

		if (!serverQueue) {
			const queueConstruct = {
				textChannel: channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 1,
				playing: true,
				i: 0,
				jump: -1,
			};

			queue.set(guild.id, queueConstruct);

			queueConstruct.songs = songlist;

			if (spotPlaylist) 
        queueConstruct.textChannel.send("🎼 Spotify playlist found !!");
      else
        queueConstruct.textChannel.send("🎼 Youtube playlist found !!");

			try {
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				playy(msg, queueConstruct.songs[queueConstruct.i++]);
			} catch (err) {
				console.log(err);
				queue.delete(guild.id);
				return channel.send(err);
			}
		} else {
			const songz = serverQueue.songs;
			let a = serverQueue.i;
			songlist.forEach((element) => {
				element.id = ++a;
			});
			serverQueue.songs = songz.concat(songlist);
			console.log(serverQueue.songs);

			if (serverQueue.songs.length === songlist.length) {
				playy(msg, serverQueue.songs[serverQueue.i++]);
			} else return channel.send(`🎼 Playlist has been added to the queue!`);
		}

		urllist = [];
		songlist = [];
	} else {
		try {
      if (isSpot) {
        console.log("Spotify URL found !");
        var spotSong;
        var isTrack = await spotifyToYT.isTrackOrPlaylist(args)
        if (isTrack === 'track') {
          spotSong = await spotifyToYT.trackGet(args)
          query = spotSong.url;
        }
      }
      else {
        const video = await videoFinder(args);
        if (matchYoutubeUrl(args)) {
          console.log("URL found !");
          query = args;
        } else {
          query = video.url;
        }
      }
      // console.log("----> " + query)
    }
    catch(err) {
      console.log(`${err.name}: ${err.message}`);
      return msg.channel.send(":/ Encountered a problem with the url: " +err.message);
    }
    
    var songInfo;
    try {
      songInfo = await ytdl.getInfo(query);
    }
    catch(err) {
      console.log(`${err.name}: ${err.message}`);
      return msg.channel.send(":/ Encountered a problem with the song: " +err.message);
    }
		
		const song = {
			id: id,
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
		};
		id++;
		msg.client.id.set(guild.id, id);
		// console.log("R_id " + id);

		console.log("Song found and pushed !");

		if (!serverQueue) {
			const queueConstruct = {
				textChannel: channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 1,
				playing: true,
				i: 0,
				jump: -1,
			};

			queue.set(guild.id, queueConstruct);

			queueConstruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				playy(msg, queueConstruct.songs[queueConstruct.i++]);
			} catch (err) {
				console.log(err);
				queue.delete(guild.id);
				return channel.send(err);
			}
		} else {
			serverQueue.songs.push(song);
			if (serverQueue.songs.length === 1) {
				playy(msg, serverQueue.songs[serverQueue.i++]);
			} else
				return channel.send(
					`🎶 **${song.title}** has been added to the queue!`
				);
		}
	}
}

async function playy(msg, song) {
	const queue = msg.client.queue;
	const guild = msg.guild;
	const serverQueue = queue.get(guild.id);

	console.log("Now playing: ");
	console.log(serverQueue.i);
	console.log(song);

	if (!song) {
    serverQueue.voiceChannel.leave()
		serverQueue.textChannel.send(`Finished playing. ✨`);
    queue.delete(guild.id);
		msg.client.id.set(guild.id, 1);
		return;
	}

	const stream = ytdl(song.url, {
		filter: "audioonly",
		quality: "highestaudio",
	});

	const dispatcher = serverQueue.connection
		.play(stream, { seek: 0, volume: 1 })
		.on("finish", () => {
			if (msg.client.shuffle.get(guild.id)) {
				if (serverQueue.jump != -1) {
					serverQueue.i = serverQueue.jump;
					serverQueue.jump = -1;
				} else serverQueue.i = randInt(0, serverQueue.songs.length);
				playy(msg, serverQueue.songs[serverQueue.i++]);
			} else playy(msg, serverQueue.songs[serverQueue.i++]);
		});
	serverQueue.textChannel.send(`🎶 Now playing: **${song.title}**`);
}

function matchYoutubeUrl(url) {
	var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  var q = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
  var r = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm;
	if (url.match(p) || url.match(q) || url.match(r)) return true;
	return false;
}

function isPlaylist(url) {
	// var q = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
  var q = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
	if (url.match(q)) {
		flag = true;
		return true;
	}
	return false;
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = play;
