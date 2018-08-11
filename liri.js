require("dotenv").config();
let keys = require('./keys');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');
let fs = require('fs');

let client = new Twitter(keys.twitter);
let spotify = new Spotify(keys.spotify);

let command = process.argv[2];
let secondQuery = process.argv[3];

function liriBot(arg, arg2) {
    if (arg === 'my-tweets') {
            client.get('statuses/user_timeline', {screen_name: 'twitterapi', count: '20'}, function(error, tweets, response) {
                if (error) {
                    throw error;
                }
                console.log(tweets);
            })
    }

    if (arg === 'spotify-this-song') {
            if (typeof arg2 === 'undefined') {
                spotify.search({type: 'track', query: 'the sign ace of base'}, function(error, data) {
                    if (error) {
                        throw error;
                    }
                    console.log(data.tracks.items[0]);
                }) 
            } else {

                spotify.search({type: 'track', query: arg2}, function(error, data) {
                    if (error) {
                        throw error;
                    }
                    console.log(data.tracks.items[0]);
                })
            }
    }

    if (arg === 'movie-this') {
            if (typeof arg2 === 'undefined') {
                request("http://www.omdbapi.com/?apikey=c33bdeed&t=mr+nobody", function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(JSON.parse(body, null, 2));
                    } else if (error) {
                        throw error;
                    }
                })
            } else {

                request("http://www.omdbapi.com/?apikey=c33bdeed&t=" + arg2, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(JSON.parse(body, null, 2));
                    } else if (error) {
                        throw error;
                    }
                })
            }
    }

    if (arg === 'do-what-it-says') {
            fs.readFile('./random.txt', 'utf8', function(error, data) {
                if (error) {
                    throw error;
                }
                let dataArr = data.split(",");
                console.log(dataArr);
                liriBot(dataArr[0], dataArr[1]);
            })
    }
}

liriBot(command, secondQuery);


