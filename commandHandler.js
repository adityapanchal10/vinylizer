require('dotenv').config();
const log = require('log-to-file');

// const fs = require("fs");

const ping = require('./commands/ping');
const userinfo = require('./commands/userinfo');
const play = require('./commands/play');
const queue = require('./commands/queue');
const pause = require('./commands/pause');
const resume = require('./commands/resume');
const clear = require('./commands/clear');
const leave = require('./commands/leave');
const next = require('./commands/next');
const previous = require('./commands/previous');
const botinfo = require('./commands/botinfo');
const help = require('./commands/help');
const save = require('./commands/save');
const playsaved = require('./commands/playsaved');
const jumpto = require('./commands/jumpto');
const viewsaved = require('./commands/viewsaved');
const shuffle = require('./commands/shuffle');
const uptime = require('./commands/uptime');
const cls = require('./commands/cls');
const allowShubhda = require('./commands/allowShubhda');
const recommend = require('./commands/recommend');


const p = play;
const q = queue;
const n = next;
const skip = next;
const h = help;
const s = shuffle;

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
	p,
	q,
	n,
	skip,
	h,
	s,
	uptime,
	cls,
	allowShubhda,
	recommend,
};

module.exports = async function(msg) {
	if (
		msg.channel.id === process.env.CHANNELID1 ||
		msg.channel.id === process.env.CHANNELID2 ||
		msg.channel.id === process.env.CHANNELID3 ||
		msg.channel.id === process.env.CHANNELID4 ||
		msg.channel.id === process.env.CHANNELID5
	) {
		// console.log(msg.content);
		const tokens = msg.content.split(' ');
		// console.log(tokens);
		let command = tokens.shift();
		// console.log(command);
		if (command.charAt(0) === process.env.ID) {
			command = command.substring(1);
			// console.log(command);

			if (msg.author.id === 'panki#6010' && !msg.client.allowShubhda) {return msg.channel.send('Shubda not allowed :/');}

			if (!commandList[command]) {
				log(`${msg.author.tag}: Invalid command entered - ${command}, Arguments - ${tokens.join(' ')}`, './error_logs.txt');
				return msg.channel.send('Please enter a valid command, for more info type **-help**');
			}
			log(`${msg.author.tag}: Command entered - ${command}, Arguments - ${tokens.join(' ')}`, './logs.txt');
			commandList[command](msg, tokens.join(' '));
		}
	}
};
