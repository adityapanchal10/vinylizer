/* eslint-disable no-var */
/* eslint-disable no-inline-comments */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const ytpl = require('ytpl');
const spotifyToYT = require('spotify-to-yt');
const log = require('log-to-file');

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
	if (!voiceChannel) {return channel.send('Need to be connected in a voice channel.');}

	const perm = voiceChannel.permissionsFor(msg.client.user);
	if (!perm.has('CONNECT') || !perm.has('SPEAK')) {return channel.send('You do not have necessary permissions.');}

	if (!args) {return channel.send('Please enter a valid song name or link.');}

	const serverQueue = msg.client.queue.get(guild.id);
	const queue = msg.client.queue;

	const videoFinder = async (query) => {
		const videoResult = await ytSearch(query);
		return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
	};

	// console.log(args);

	const isSpot = await spotifyToYT.validateURL(args);
	let spotPlaylist = false;
	if (isSpot) {spotPlaylist = await spotifyToYT.isTrackOrPlaylist(args) === 'playlist' ? true : false;}

	if (isPlaylist(args) || spotPlaylist) {
		let response, list;

		channel.send('Playlist url processing, please wait.');

		if (spotPlaylist) {
			console.log('Spotify playlist found.');
			log(`${msg.author.tag}: Spotify playlist added, URL - ${args}`, 'play_logs.txt');
			try {
				response = await spotifyToYT.playListGet(args);
			}
			catch (err) {
				console.log(`${err.name}: ${err.message}`);
				return msg.channel.send(':/ Encountered a problem with the url: ' + err.message);
			}
			// console.log(response);
			log(`${msg.author.tag}: converted spotify to yt successfully.`, 'play_logs.txt');
			urllist = response.songs;
		}
		else {
			console.log('Yt playlist url found.');
			log(`${msg.author.tag}: YouTube playlist added, URL - ${args}`, 'play_logs.txt');
			try {
				response = await ytpl(args);
			}
			catch (err) {
				console.log(`${err.name}: ${err.message}`);
				return msg.channel.send(':/ Encountered a problem with the url: ' + err.message);
			}
			list = response.items;
			list.forEach((element) => {
				urllist.push(element.shortUrl);
			});
		}

		// console.log(urllist);

		for (const item of urllist) {
			try {
				const songInfo = await ytdl.getInfo(item);
				const song = {
					id: id,
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
				};
				songlist.push(song);
				id++;
			}
			catch (err) {
				console.log(`${err.name}: ${err.message}`);
				return msg.channel.send(':/ Encountered a problem with the song:' + err.message);
			}
		}

		console.log('Songs retrieved and pushed successfully.');
		log(`${msg.author.tag}: songlist created successfully`, 'play_logs.txt');

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
				i: 0, // song index to be played
				jump: -1,
			};

			queue.set(guild.id, queueConstruct);

			queueConstruct.songs = songlist;

			if (spotPlaylist) {
				queueConstruct.textChannel.send('🎼 Spotify playlist found !!');
				log(`${msg.author.tag}: Spotify Queue constructed`, 'play_logs.txt');
			}
			else {
				log(`${msg.author.tag}: YouTube Queue constructed`, 'play_logs.txt');
				queueConstruct.textChannel.send('🎼 Youtube playlist found !!');
			}

			try {
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				connection.voice.setSelfDeaf(true);
				playy(msg, queueConstruct.songs[queueConstruct.i++]);
			}
			catch (err) {
				console.log(err);
				queue.delete(guild.id);
				return channel.send(err);
			}
		}
		else {
			const songz = serverQueue.songs;
			let a = serverQueue.i;
			songlist.forEach((element) => {
				element.id = ++a;
			});
			serverQueue.songs = songz.concat(songlist);
			// console.log(serverQueue.songs);

			if (serverQueue.songs.length === songlist.length) {
				playy(msg, serverQueue.songs[serverQueue.i++]);
			}
			else {
				log(`${msg.author.tag}: playlist added to Queue`, 'play_logs.txt');
				return channel.send('🎼 Playlist has been added to the queue!');
			}
		}
		urllist = [];
		songlist = [];
	}
	else {
		try {
			if (isSpot) {
				console.log('Spotify URL found !');
				log(`${msg.author.tag}: Spotify song added, URL - ${args}`, 'play_logs.txt');
				let spotSong;
				const isTrack = await spotifyToYT.isTrackOrPlaylist(args);
				if (isTrack === 'track') {
					spotSong = await spotifyToYT.trackGet(args);
					query = spotSong.url;
					log(`${msg.author.tag}: converted spotify track to youtube successfully.`, 'play_logs.txt');
				}
			}
			else if (matchYoutubeUrl(args)) {
				console.log('URL found !');
				log(`${msg.author.tag}: YouTube song added, URL - ${args}`, 'play_logs.txt');
				query = args;
			}
			else {
				const video = await videoFinder(args);
				log(`${msg.author.tag}: YouTube song added, Name - ${args}`, 'play_logs.txt');
				query = video.url;
			}
			// console.log("----> " + query)
		}
		catch (err) {
			console.log(`${err.name}: ${err.message}`);
			return msg.channel.send(':/ Encountered a problem with the url: ' + err.message);
		}

		let songInfo;
		try {
			songInfo = await ytdl.getInfo(query);
		}
		catch (err) {
			console.log(`${err.name}: ${err.message}`);
			return msg.channel.send(':/ Encountered a problem with the song: ' + err.message);
		}

		const song = {
			id: id,
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
		};
		id++;
		msg.client.id.set(guild.id, id);
		// console.log("R_id " + id);
		log(`${msg.author.tag}: song is valid`, 'play_logs.txt');

		console.log('Song found and pushed !');

		if (!serverQueue) {
			const queueConstruct = {
				textChannel: channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 1,
				playing: true,
				i: 0, // song index to be played
				jump: -1,
			};

			queue.set(guild.id, queueConstruct);
			log(`${msg.author.tag}: song Queue created successfully`, 'play_logs.txt');
			queueConstruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				connection.voice.setSelfDeaf(true);
				playy(msg, queueConstruct.songs[queueConstruct.i++]);
				console.log('connection successful !');
			}
			catch (err) {
				console.log(err);
				queue.delete(guild.id);
				return channel.send(err);
			}
		}
		else {
			serverQueue.songs.push(song);
			if (serverQueue.songs.length === 1) {
				playy(msg, serverQueue.songs[serverQueue.i++]);
			}
			else {
				log(`${msg.author.tag}: song added to Queue`, 'play_logs.txt');
				return channel.send(
					`🎶 **${song.title}** has been added to the queue!`,
				);
			}
		}
	}
}

const sleep = (ms = 60000) => new Promise((r) => setTimeout(r, ms));

async function playy(msg, song) {
	const queue = msg.client.queue;
	const guild = msg.guild;
	const serverQueue = queue.get(guild.id);
	let stream;

	console.log('Now playing: ');
	console.log(serverQueue.i);
	console.log(song);
	if (song.title) {log(`${msg.author.tag}: Now playing - ${serverQueue.i}. ${song.title}`, 'play_logs.txt');}

	if (!song) {
		queue.delete(guild.id);
		msg.client.id.set(guild.id, 1);
		await sleep();
		if (!msg.client.queue.get(guild.id)) {
			serverQueue.textChannel.send('Finished playing. ✨');
			serverQueue.voiceChannel.leave();
		}
		return;
	}

	try {
		stream = ytdl(song.url, {
			filter: 'audioonly',
			quality: 'highestaudio',
		});
		log(`${msg.author.tag}: song (${song.title}) audio stream created.`, 'play_logs.txt');
	}
	catch (error) {
		console.log(error);
		return msg.channel.send(':/ Audio stream could not be created: ' + error.name);
	}

	try {
		const dispatcher = serverQueue.connection
			.play(stream, { seek: 0, volume: 1 })
			.on('finish', () => {
				if (msg.client.shuffle.get(guild.id)) {
					if (serverQueue.jump != -1) {
						serverQueue.i = serverQueue.jump;
						serverQueue.jump = -1;
					}
					else {serverQueue.i = randInt(0, serverQueue.songs.length);}
					log(`${msg.author.tag}: Song streaming - ${serverQueue.i}. ${song.title}, Shuffle: ON`, 'play_logs.txt');
					playy(msg, serverQueue.songs[serverQueue.i++]);
				}
				else {
					log(`${msg.author.tag}: Song streaming - ${serverQueue.i}. ${song.title}, Shuffle: OFF`, 'play_logs.txt');
					playy(msg, serverQueue.songs[serverQueue.i++]);
				}
			});
		serverQueue.textChannel.send(`🎶 Now playing: **${song.title}**`);
	}
	catch (error) {
		console.log(error);
		return msg.channel.send(':/ Error occured while playing song: ' + error.name);
	}


}

function matchYoutubeUrl(url) {
	const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	const q = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
	const r = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm;
	if (url.match(p) || url.match(q) || url.match(r)) return true;
	return false;
}

function isPlaylist(url) {
	// var q = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
	const q = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
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
