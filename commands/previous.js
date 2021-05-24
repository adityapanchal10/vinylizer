module.exports = function (msg, args) {
	const { channel } = msg.member.voice;
	if (!channel)
		return msg.channel.send(
			"I'm sorry but you need to be in a voice channel to play music!"
		);
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (!serverQueue)
		return msg.channel.send(
			"There is nothing playing that I could skip for you."
		);
	if (serverQueue.i === 1)
		return serverQueue.textChannel.send("Starting of queue reached !!");
	serverQueue.i -= 2;
	serverQueue.connection.dispatcher.end("Previous command has been used!");
};
