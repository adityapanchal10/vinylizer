module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (serverQueue) {
		serverQueue.playing = true;
		serverQueue.songs.length = 1;
		serverQueue.i = 1;
		serverQueue.jump = -1;
		msg.client.id.set(msg.guild.id, 2);
		msg.client.shuffle.set(msg.guild.id, false);
		return serverQueue.textChannel.send("Queue cleared!");
	}
	return msg.channel.send("There is nothing playing.");
};