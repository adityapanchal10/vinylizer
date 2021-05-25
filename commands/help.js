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
				value: "!botinfo",
			},
			{
				name: "Get user info",
				value: "!userinfo OR !userinfo @someone",
			},
			{
				name: "Play a song",
				value: `!play song_name / song_url (adds to queue if a song is playing currently)`,
			},
			{
				name: "See queue",
				value: `!queue`,
			},
			{
				name: "Play next song in queue",
				value: `!next`,
			},
			{
				name: "Play previous song in queue",
				value: `!previous`,
			},
			{
				name: "Clear queue",
				value: `!clear`,
			},
			{
				name: "Pause currently playing song",
				value: `!pause`,
			},
			{
				name: "Resume paused song",
				value: `!resume`,
			},
			{
				name: "Shuffle the queue",
				value: `!shuffle on/off`,
			},
			{
				name: "Jump to a song in queue",
				value: `!jumpto song_number`,
			},
			{
				name: "Save the current queue for later",
				value: `!save queue_name`,
			},
			{
				name: "Play a saved queue",
				value: `!playsaved queue_name`,
			},
			{
				name: "See saved playlists",
				value: `!viewsaved`,
			},
			{
				name: "Stop playing and leave",
				value: `!leave`,
			}
		);

	msg.channel.send(embed);
};
