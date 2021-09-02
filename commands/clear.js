module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (serverQueue) {
		serverQueue.connection.dispatcher.pause();
		serverQueue.playing = true;
		serverQueue.songs = [];
		serverQueue.i = 0;
		serverQueue.jump = -1;
		msg.client.id.get(msg.guild.id) = 1;
		msg.client.shuffle.get(msg.guild.id) = false;
		return serverQueue.textChannel.send("Queue cleared!");
	}
	return msg.channel.send("There is nothing playing.");
};
