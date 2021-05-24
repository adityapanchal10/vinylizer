// import { playy } from "./play.js";
const fs = require("fs");
const ytdl = require("ytdl-core");

async function playsaved(msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	const { guild, channel, member } = msg;
	const queue = msg.client.queue;
	const voiceChannel = member.voice.channel;
	if (!voiceChannel)
		return channel.send("Need to be connected in a voice channel.");

	const perm = voiceChannel.permissionsFor(msg.client.user);
	if (!perm.has("CONNECT") || !perm.has("SPEAK"))
		return channel.send("You do not have necessary permissions.");

	if (!fs.existsSync(`saved/${args}.json`))
    		return channel.send("No such saved playlist found :/");
	const databuffer = fs.readFileSync(`saved/${args}.json`);
	const dataJSON = databuffer.toString();
	const playlist = JSON.parse(dataJSON);

	msg.client.id = playlist[playlist.length - 1].id + 2;
	// console.log(msg.client.id);

	if (serverQueue) {
		const songz = serverQueue.songs;
		let a = serverQueue.i;
		playlist.forEach((element) => {
			element.id = ++a;
		});
		serverQueue.songs = songz.concat(playlist);
		// console.log(serverQueue.songs);
		if (serverQueue.songs.length === playlist.length) {
			playy(msg, serverQueue.songs[serverQueue.i++]);
		} else return channel.send(`Playlist has been added to the queue!`);
	} else {
		// console.log("nada");
		const queueConstruct = {
			textChannel: channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 1,
			playing: true,
			i: 0,
		};

		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs = playlist;

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			playy(msg, queueConstruct.songs[queueConstruct.i++]);
		} catch (err) {
			console.log(err);
			queue.delete(guild.id);
			return channel.send(err);
		}
	}
}

function playy(msg, song) {
	const queue = msg.client.queue;
	const guild = msg.guild;
	const serverQueue = queue.get(guild.id);

	console.log(serverQueue.i);
	console.log(song);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		serverQueue.textChannel.send(`Finished playing.`);
		msg.client.id = 1;
		return;
	}

	const stream = ytdl(song.url, {
		filter: "audioonly",
		quality: "highestaudio",
	});

	const dispatcher = serverQueue.connection
		.play(stream, { seek: 0, volume: 1 })
		.on("finish", () => {
			playy(msg, serverQueue.songs[serverQueue.i++]);
		});
	serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}

module.exports = playsaved;
