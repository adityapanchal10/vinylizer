module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (!serverQueue) return msg.channel.send("There is nothing playing.");
	if (serverQueue.songs.length === 0)
		return serverQueue.textChannel.send("Queue is empty! Add some music.");
	return serverQueue.textChannel.send(`
__**Song queue:**__
${serverQueue.songs.map((song) => `${song.id} **-** ${song.title}`).join("\n")}
Now playing: **${serverQueue.songs[serverQueue.i - 1].id} - ${
		serverQueue.songs[serverQueue.i - 1].title
	}**
		`);
};
