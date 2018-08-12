require("dotenv").config();
const keys = require('./keys');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);

const liriResponse = chalk.blue;


function liriBot(arg, arg2) {
    if (arg === 'tweets') {
            client.get('statuses/user_timeline', {screen_name: 'twitterapi', count: '20'}, function(error, tweets, response) {
                if (error) {
                    throw error;
                }
                console.log(tweets);
                console.log(liriResponse("Here's some tweets! Hope you enjoy them, we had to work hard to get them!"));
            })
    }

    if (arg === 'spotify') {
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

    if (arg === 'movie') {
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

}



inquirer.prompt({
    type : 'list',
    name : 'choice',
    message : 'What action would you like me to perform?',
    choices : [
        'Print tweets',
        'Search Spotify for song info',
        'Search OMDB for movie info',
        'Do what it says!'
    ]
}).then(function(cmdChoice) {
    if (cmdChoice.choice === 'Print tweets') {
        liriBot('tweets');
    } else if (cmdChoice.choice === 'Search Spotify for song info') {
        inquirer.prompt({
            type : 'input',
            name : 'songChoice',
            message : "What song?"
        }).then(function(userSong) {
            if (userSong.songChoice === '') {
                liriBot('spotify');
            } else {
                liriBot('spotify', userSong.songChoice);
            }
        })
    } else if (cmdChoice.choice === 'Search OMDB for movie info') {
        inquirer.prompt({
            type : 'input',
            name : 'movieChoice',
            message : "What movie?"
        }).then(function(userMovie) {
            if (userMovie.movieChoice === '') {
                liriBot('movie');
            } else {
                liriBot('movie', userMovie.movieChoice);
            }
        })
    } else if (cmdChoice.choice === 'Do what it says!') {
        liriBot('do-what-it-says');
    }
})