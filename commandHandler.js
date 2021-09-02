require("dotenv").config();

// const fs = require("fs");

const ping = require("./commands/ping");
const userinfo = require("./commands/userinfo");
const play = require("./commands/play");
const queue = require("./commands/queue");
const pause = require("./commands/pause");
const resume = require("./commands/resume");
const clear = require("./commands/clear");
const leave = require("./commands/leave");
const next = require("./commands/next");
const previous = require("./commands/previous");
const botinfo = require("./commands/botinfo");
const help = require("./commands/help");
const save = require("./commands/save");
const playsaved = require("./commands/playsaved");
const jumpto = require("./commands/jumpto");
const viewsaved = require("./commands/viewsaved");

const shuffle = require("./commands/shuffle");

const commandList = {
	ping,
	userinfo,
	play,
	queue,
	pause,
	leave,
	clear,
	resume,
	next,
	previous,
	botinfo,
	help,
	save,
	playsaved,
	jumpto,
	viewsaved,
	shuffle,

};

module.exports = async function (msg) {
	if (
		msg.channel.id === process.env.CHANNELID1 ||
		msg.channel.id === process.env.CHANNELID2 ||
    msg.channel.id === process.env.CHANNELID3 ||
    msg.channel.id === process.env.CHANNELID4
	) {
		// console.log(msg.content);
		let tokens = msg.content.split(" ");
		// console.log(tokens);
		let command = tokens.shift();
		// console.log(command);
		if (command.charAt(0) === process.env.ID) {
			command = command.substring(1);
			// console.log(command);
			
    if (!commandList[command])
      return msg.channel.send(`Please enter a valid command, for more info type **!help**`);
    commandList[command](msg, tokens.join(` `));
		}
	}
};
