module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (serverQueue && !serverQueue.playing) {
		serverQueue.playing = true;
		serverQueue.connection.dispatcher.resume();
		return serverQueue.textChannel.send("▶ Resumed the music for you!");
	}
	return msg.channel.send("There is nothing playing.");
};
