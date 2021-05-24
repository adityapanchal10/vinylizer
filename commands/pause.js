module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (serverQueue && serverQueue.playing) {
		serverQueue.playing = false;
		serverQueue.connection.dispatcher.pause();
		return serverQueue.textChannel.send("⏸ Paused the music for you!");
	}
	return msg.channel.send("There is nothing playing.");
};
