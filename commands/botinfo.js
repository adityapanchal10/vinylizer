const { MessageEmbed } = require("discord.js");
const { version } = require("../package.json");

module.exports = function (msg, args) {
	const embed = new MessageEmbed()
		.setAuthor(
			`${msg.client.user.username} info`,
			msg.client.user.displayAvatarURL()
		)
		.addFields(
			{
				name: "Bot tag",
				value: msg.client.user.tag,
			},
			{
				name: "Version",
				value: version,
			},
			{
				name: "Platform",
				value: `${process.platform}`,
			},
			{
				name: "Arch",
				value: `${process.arch}`,
			},
			{
				name: "Uptime",
				value: `${process.uptime().toFixed(2)}s`,
			},
			{
				name: "Server Count",
				value: msg.client.guilds.cache.size,
			},
			{
				name: "Author",
				value: `adit #8074`,
			}
		);

	msg.channel.send(embed);
};
