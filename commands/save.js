const fs = require("fs");

module.exports = function (msg, args) {
	const serverQueue = msg.client.queue.get(msg.guild.id);
	if (serverQueue) {
		const playlist = JSON.stringify(serverQueue.songs);

		fs.writeFile(`saved/${args}.json`, playlist, (err) => {
			if (err) {
				throw err;
			}
			console.log(
				`JSON playlist data is saved => ${args}.json [${msg.author.tag}]`
			);
			return serverQueue.textChannel.send("Playlist saved !");
		});
	} else return msg.channel.send("There is nothing playing.");
};
