require("dotenv").config();
const { MessageEmbed } = require('discord.js');
const getArtistTitle = require('get-artist-title');

const spot_client = process.env.SPOT_CLIENT;
const spot_client_secret = process.env.SPOT_CLIENT_SECRET;

const request = require('request');
let spot_id, spot_artist, spot_album;
let recommendation_list = [];

module.exports = function(msg, args) {
  
  const auth = Buffer.from(spot_client + ":" + spot_client_secret).toString("base64");
  
  const { guild, channel, member } = msg;

  const voiceChannel = member.voice.channel;
  if (!voiceChannel)
    return channel.send("Need to be connected in a voice channel.");

  const perm = voiceChannel.permissionsFor(msg.client.user);
  if (!perm.has("CONNECT") || !perm.has("SPEAK"))
    return channel.send("You do not have necessary permissions.");

  if (!args){
    const serverQueue = msg.client.queue.get(msg.guild.id);
	  if (serverQueue && serverQueue.songs.length != 0) {
		  args = serverQueue.songs[serverQueue.i - 1].title;
      let [ artist, title ] = getArtistTitle(args);
      if (title)
        args = title;
      console.log(`Searching recommendations for '${args}'`);
	  } else 
      return msg.channel.send("There is nothing playing.");
  }
  
  // your application requests authorization
  var authOptions = {
  	url: "https://accounts.spotify.com/api/token",
  	headers: {
  		Authorization: "Basic " + auth,
  		"content-type": "application/x-www-form-urlencoded",
  	},
  	form: {
  		grant_type: "client_credentials",
  	},
  	json: true,
  };
  
  request.post(authOptions, function (error, response, body) {
  	if (!error && response.statusCode === 200) {
  		// use the access token to access the Spotify Web API
  		var token = body.access_token;
  		
  		var options = {
  			url: `https://api.spotify.com/v1/search?q=${args}&type=track`,
  			headers: {
  				Authorization: "Bearer " + token,
  			},
  			json: true,
  		};
      
  		request.get(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          
    			if (body.tracks.items.length === 0)
            return msg.channel.send("No recommendations found :/");
          
    			spot_id = body.tracks.items[0].id;
          spot_album = body.tracks.items[0].album.name;
          spot_artist = body.tracks.items[0].artists[0].id;
    
    			var recOptions = {
    				url:
    					`https://api.spotify.com/v1/recommendations?seed_tracks=${spot_id}&seed_artists=${spot_artist}&limit=5`,
    				headers: {
    					Authorization: "Bearer " + token,
    				},
    				json: true,
    			};
    			request.get(recOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              for (let item of body.tracks) {
                var rec_song = {
                  id: item.id,
                  name: item.name,
                  url: item.external_urls.spotify,
                  artist: item.artists[0].name,
                  album: item.album.name,
                };
                recommendation_list.push(rec_song);
              }
              // console.log(recommendation_list);

              if (recommendation_list.length === 0)
          			return msg.channel.send("No recommendations :/");
          		return msg.channel.send(`
          __**Recommendations (Similar to '${args}'):**__
${recommendation_list.map((song) => `-> ${song.name}  **by**  ${song.artist},  Album: ${song.album}`).join("\n")}`);
              
            } else {
              console.log('Error in getting seed song.')
              console.log(error);
            }
    			});
        } else {
          console.log('Error in getting seed song.')
          console.log(error);
        }  
  		});
  	} else {
      console.log('Error in getting token.')    
  		console.log(response.statusCode);
      console.log(error);
  	}
  });
}