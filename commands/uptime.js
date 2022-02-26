const { MessageEmbed } = require("discord.js");
const { version } = require("../package.json");
const os = require('os');
const Fs = require('fs');

let dd, upt;

module.exports = function (msg, args) {
  function createdDate (file) {  
    const { birthtime } = Fs.statSync(file)
    return birthtime
  }
  const dateCreated = createdDate('./init.txt');
  // console.log(dateCreated.getTime());

  Fs.readFile('./init.txt', (err, data) => {
    dd = String(data);
    dd = dd.split('->')[1];
    dd = parseInt(dd);
    console.log(dd);
    // console.log(typeof(dd));

    const d = new Date();
    var millis1 = d.getTime() - dateCreated.getTime();
    millis1 = Math.floor(millis1/1000); // get seconds
    console.log(millis1);
    var dayz1 = millis1/86400; // get days
    // var days = Math.floor(process.uptime());
    // console.log(`${d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds()}`);
    console.log(dayz1);
    // days = days/(24*3600);
    // console.log(days);
    console.log(`OS uptime: ${os.uptime()/86400} days`);

    var millis2 = d.getTime() - dd;
    millis2 = Math.floor(millis2/1000); // get seconds
    console.log(millis2);
    var dayz2 = millis2/86400;
    console.log(dayz2);

    dayz2 > dayz1 ? upt = dayz2 : upt = dayz1;

    return msg.channel.send(`Uptime: ${upt.toFixed(2)} days.`);
  })  
}