module.exports = function (msg, args) {
	const queue = msg.client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (serverQueue) {
		serverQueue.songs = [];
		serverQueue.i = 0;
		serverQueue.jump = -1;
		msg.client.shuffle.set(msg.guild.id, false);
		msg.client.id.set(msg.guild.id, 1);
    serverQueue.voiceChannel.leave();
		queue.delete(msg.guild.id);
		serverQueue.textChannel.send(`Leaving voice.`);
		console.log("Voice channel left.");
	} else return msg.channel.send("Voice not connected.");
};
