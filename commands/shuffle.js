module.exports = function(msg, args) {
  const serverQueue = msg.client.queue.get(msg.guild.id);
  if (serverQueue && serverQueue.playing) {
    if (msg.client.shuffle.get(msg.guild.id)) {
      if (args === "on")
        return serverQueue.textChannel.send("Shuffle is already on !!");
      if (args === "off") {
        msg.client.shuffle.set(msg.guild.id, false);
        return serverQueue.textChannel.send("Shuffle turned off !!");
      } else
        return serverQueue.textChannel.send(
          `Shuffle currently ON, use **!shuffle off** to turn it off.`
        );
    } else {
      if (args === "off")
        return serverQueue.textChannel.send("Shuffle is already off !!");
      if (args === "on") {
        msg.client.shuffle.set(msg.guild.id, true);
        return serverQueue.textChannel.send("Shuffle turned on !!");
      } else
        return serverQueue.textChannel.send(
          `Shuffle currently OFF, use **!shuffle on** to turn it on.`
        );
    }
  }
  return msg.channel.send("There is nothing playing.");
};
