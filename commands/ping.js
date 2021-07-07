module.exports = function (msg, args) {
	msg.channel.send(`🏓 pong! \nLatency: ${Date.now() - msg.createdTimestamp}ms. API Latency: ${Math.round(msg.client.ws.ping)}ms`);
	console.log(`Ponging ${msg.author.tag} 🏓 \nMessage latency: ${Date.now() - msg.createdTimestamp}ms. API latency: ${Math.round(msg.client.ws.ping)}ms`);
};
