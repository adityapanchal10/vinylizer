const fs = require("fs");


module.exports = function (msg, args) {
  // const serverQueue = msg.client.queue.get(msg.guild.id);
	fs.readdir("./saved", function (err, files) {
		if (err) {
			return console.log("Unable to scan directory: " + err);
		}
		return msg.channel.send(`
__**Saved Playlists:**__
${files.map((pl) => pl.split(".")[0]).join("\n")}`);
	});
};
