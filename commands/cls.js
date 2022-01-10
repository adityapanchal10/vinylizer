module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (serverQueue) {
		serverQueue.playing = true;
		serverQueue.songs = [];
		serverQueue.i = 0;
		serverQueue.jump = -1;
		msg.client.id.set(msg.guild.id, 1);
		msg.client.shuffle.set(msg.guild.id, false);
		return serverQueue.textChannel.send("Queue cleared!");
	}
	return msg.channel.send("There is nothing playing.");
};