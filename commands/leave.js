module.exports = function (msg, args) {
	const queue = msg.client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (serverQueue) {
		serverQueue.voiceChannel.leave();
		queue.delete(msg.guild.id);
		msg.client.shuffle = false;
		serverQueue.textChannel.send(`Leaving voice.`);
    console.log("Voice channel left.");
	} else return msg.channel.send("Voice not connected.");
};
