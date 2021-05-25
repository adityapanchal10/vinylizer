const fs = require("fs");

module.exports = function (msg, args) {
	fs.readdir("./saved", function (err, files) {
		if (err) {
			return console.log("Unable to scan directory: " + err);
		}
		return serverQueue.textChannel.send(`
__**Saved Playlists:**__
${files.map((pl) => pl.split(".")[0]).join("\n")}`);
	});
};
