module.exports = function (msg, args) {
	msg.channel.send("🏓 pong!");
	console.log(`Ponging ${msg.author.tag} 🏓`);
};
