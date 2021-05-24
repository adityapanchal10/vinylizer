const { MessageEmbed } = require("discord.js");

module.exports = function (msg, args) {
	const { guild, channel, member } = msg;
	const user = msg.mentions.users.first() || msg.member.user;

	const embed = new MessageEmbed()
		.setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
		.addFields(
			{
				name: "User tag",
				value: user.tag,
			},
			{
				name: "Nickname",
				value: member.nickname || "None",
			},
			{
				name: "Joined server",
				value: new Date(member.joinedAt).toLocaleDateString(),
			},
			{
				name: "Joined Discord",
				value: new Date(user.createdAt).toLocaleDateString(),
			},
			{
				name: "Roles",
				value: member.roles.cache.size - 1,
			},
			{
				name: "Is bot",
				value: user.bot,
			}
		);

	channel.send(embed);
};
