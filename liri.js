require("dotenv").config();
let keys = require('./keys');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');
let fs = require('fs');

let client = new Twitter(keys.twitter);
let spotify = new Spotify(keys.spotify);

let command = process.argv[2];

switch(command) {
    case "my-tweets" : 
    callTweets();
    break;
    case "spotify-this-song" : 
    callSpotify();
    break;
    case "movie-this" : 
    callOMDB();
    break;
    case "do-what-it-says" : 
    callRandom();
    break;
    default : console.log("Invalid command! Beep boop. LIRI does not compute.");
}

function callTweets() {
        client.get('statuses/user_timeline', {screen_name: 'twitterapi', count: '20'}, function(error, tweets, response) {
            if (error) {
                throw error;
            }
            console.log(tweets);
        })
}

function callSpotify() {
        if (typeof process.argv[3] === 'undefined') {
            spotify.search({type: 'track', query: 'the sign ace of base'}, function(error, data) {
                if (error) {
                    throw error;
                }
                console.log(data.tracks.items[0]);
            }) 
        } else {
            let songQuery = process.argv[3];
            spotify.search({type: 'track', query: songQuery}, function(error, data) {
                if (error) {
                    throw error;
                }
                console.log(data.tracks.items[0]);
            })
        }
}

function callOMDB() {
        if (typeof process.argv[3] === 'undefined') {
            request("http://www.omdbapi.com/?apikey=c33bdeed&t=mr+nobody", function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(JSON.parse(body, null, 2));
                } else if (error) {
                    throw error;
                }
            })
        } else {
            let movieQuery = process.argv[3];
            request("http://www.omdbapi.com/?apikey=c33bdeed&t=" + movieQuery, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(JSON.parse(body, null, 2));
                } else if (error) {
                    throw error;
                }
            })
        }
}

function callRandom() {
    fs.readFile('./random.txt', function(error, data) {
        if (error) {
            throw error;
        }
        let randCommand = data;
    })
}
