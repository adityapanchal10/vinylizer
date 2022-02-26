const { Client, Collection } = require("discord.js");

module.exports = class extends (
	Client
) {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ["TYPING_START"],
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;

		this.id = new Map();

    this.shuffle = new Map();

    this.date = null;

    this.allowShubhda = true;
	
	}
};
