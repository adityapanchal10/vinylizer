const { MessageEmbed } = require("discord.js");
const { version } = require("../package.json");

module.exports = function (msg, args) {
	const embed = new MessageEmbed()
		.setAuthor(
			`Help for ${msg.client.user.username}`,
			msg.client.user.displayAvatarURL()
		)
		.addFields(
			{
				name: "Get bot info",
				value: "-botinfo",
			},
			{
				name: "Get user info",
				value: "-userinfo or -userinfo @someone",
			},
			{
				name: "Play a song",
				value: `-play song_name/song_url or -p (adds to queue if a song is currently playing)`,
			},
			{
				name: "See queue",
				value: `-queue or -q`,
			},
			{
				name: "Play next song in queue",
				value: `-next or -n`,
			},
			{
				name: "Play previous song in queue",
				value: `-previous`,
			},
			{
				name: "Clear queue",
				value: `-clear or -cls to keep currently playing song and clear the rest of the queue`,
			},
			{
				name: "Pause currently playing song",
				value: `-pause`,
			},
			{
				name: "Resume paused song",
				value: `-resume`,
			},
			{
				name: "Shuffle the queue",
				value: `-shuffle on/off or -s`,
			},
			{
				name: "Jump to a song in queue",
				value: `-jumpto song_number`,
			},
			{
				name: "Save the current queue for later",
				value: `-save queue_name`,
			},
      {
				name: "Get recommendations",
				value: `-recommend song_name or simply -recommend if there is a song currently playing`,
			},
			{
				name: "Play a saved queue",
				value: `-playsaved queue_name`,
			},
			{
				name: "See saved playlists",
				value: `-viewsaved`,
			},
			{
				name: "Stop playing and leave",
				value: `-leave`,
			}
		);

	msg.channel.send(embed);
};
