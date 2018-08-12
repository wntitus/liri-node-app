require("dotenv").config();
const keys = require('./keys');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
const chalk = require('chalk');

const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);

const liriResponse = chalk.blue;

let command = process.argv[2];
let secondQuery = process.argv[3];

function liriBot(arg, arg2) {
    if (arg === 'my-tweets') {
            client.get('statuses/user_timeline', {screen_name: 'twitterapi', count: '20'}, function(error, tweets, response) {
                if (error) {
                    throw error;
                }
                console.log(tweets);
                console.log(liriResponse("Here's some tweets! Hope you enjoy them, we had to work hard to get them!"));
            })
    }

    if (arg === 'spotify-this-song') {
            if (typeof arg2 === 'undefined') {
                spotify.search({type: 'track', query: 'the sign ace of base'}, function(error, data) {
                    if (error) {
                        throw error;
                    }
                    console.log(data.tracks.items[0]);
                    console.log(liriResponse("You wanted Ace of Base, right? No?"));
                }) 
            } else {

                spotify.search({type: 'track', query: arg2}, function(error, data) {
                    if (error) {
                        throw error;
                    }
                    console.log(data.tracks.items[0]);
                    console.log(liriResponse("Here's the song you wanted!"));
                })
            }
    }

    if (arg === 'movie-this') {
            if (typeof arg2 === 'undefined') {
                request("http://www.omdbapi.com/?apikey=c33bdeed&t=mr+nobody", function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(JSON.parse(body, null, 2));
                        console.log(liriResponse("I guess this is what you wanted!"));
                    } else if (error) {
                        throw error;
                    }
                })
            } else {

                request("http://www.omdbapi.com/?apikey=c33bdeed&t=" + arg2, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(JSON.parse(body, null, 2));
                        console.log(liriResponse("Solid choice!"));
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
                console.log(liriResponse("I did what it says!"))
            })
    }

    if (!arg) {
        console.log(chalk.red.bold("Invalid command! Beep boop, LIRI does not compute."));
    }
}

liriBot(command, secondQuery);


