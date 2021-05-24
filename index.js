require("dotenv").config();

const commandHandler = require("./commandHandler");

const Discord = require("discord.js");
// const client = new Discord.Client();
const Client = require("./client/Client");
const client = new Client();
client.login(process.env.BOTTOKEN);

client.on("ready", () => {
	console.log(`🤖 Beep boop boop beep `);
	console.log(`Logged in as ${client.user.tag}!`);
	console.log(`🌻 Hello there...`);
});

client.on("message", commandHandler);
