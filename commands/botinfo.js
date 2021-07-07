const { MessageEmbed } = require("discord.js");
const { version } = require("../package.json");
const os = require('os');
//const process = require('process');


module.exports = function (msg, args) {
  const d = new Date();
  var millis = d.getTime() - msg.client.date.getTime();
  millis = Math.floor(millis/1000); // get seconds
  console.log(millis);
  var dayz = millis/86400; // get days
  // var days = Math.floor(process.uptime());
  // console.log(`${d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds()}`);
  console.log(dayz);
  // days = days/(24*3600);
  // console.log(days);
  console.log(`OS uptime: ${os.uptime()/86400} days`);

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
				value: `${dayz.toFixed(2)}d`,
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
