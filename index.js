const mySecret = process.env['BOTTOKEN']

const log = require('log-to-file'); // for file logging
const os = require('os');

require("dotenv").config();

const commandHandler = require("./commandHandler");

const Discord = require("discord.js");
// const client = new Discord.Client();
const Client = require("./client/Client");
const client = new Client();
client.login(mySecret);

client.on("ready", () => {
	console.log(`🤖 Beep boop boop beep `);
	console.log(`Logged in as ${client.user.tag}!`);
	console.log(`🌻 Hello there...`);
  client.date = new Date();
  console.log(`Timestamp: ${client.date.toLocaleDateString()} ${client.date.toLocaleTimeString()}`);
  log(`Logged in at ${client.date.toLocaleDateString()} ${client.date.toLocaleTimeString()} ! OS uptime: ${os.uptime()/86400} days`);
});

client.on("message", commandHandler);
