module.exports = function(msg, args) {
	if (msg.client.allowShubhda) {
		if (args === 'on') {return msg.channel.send('Shubhda already allowed !');}
		if (args === 'off') {
			msg.client.allowShubhda = false;
			return msg.channel.send('Shubhda denied :/');
		}
		else {
			return msg.channel.send(
				`Shubde nubde allowed: ${msg.client.allowShubhda}`,
			);
		}
	}
	else {
		if (args === 'off') {return msg.channel.send('Shubhda already denied :/');}
		if (args === 'on') {
			msg.client.allowShubhda = true;
			return msg.channel.send('Shubhda allowed ^_^');
		}
		else {
			return msg.channel.send(
				`Shubhde nubde allowed: ${msg.client.allowShubhda}`,
			);
		}
	}
};