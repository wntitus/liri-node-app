
// Requiring all the necessary node.js packages, as well as the file that our environmental variables are in.
require("dotenv").config();
const keys = require('./keys');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Creating our variables to hold our Twitter keys and our Spotify keys

const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);

// Generating date and time variables to use for the log file

let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();

// Creating chalk style for the response text

const liriResponse = chalk.blue;

// LIRI can take two arguments, however if a certain command only requires the first argument everything still works correctly.
function liriBot(arg, arg2) {
    // Checking if the command selected is the tweet command. If it is, we use the Twitter package to make an API request, log it to the console, and add it to the log file with a timestamp.
    if (arg === 'tweets') {
            client.get('statuses/user_timeline', {screen_name: 'twitterapi', count: '20'}, function(error, tweets, response) {
                if (error) {
                    throw error;
                }
                console.log(tweets);
                console.log(liriResponse("Here's some tweets! Hope you enjoy them, we had to work hard to get them!"));
                fs.appendFile("log.txt", "\n" + hours + ":" + minutes + ":" + seconds + "---" + "Tweet Query" + "===" + JSON.stringify(tweets, null, 2), function(error) {
                    if (error) {
                        throw error
                    }
                });
            })
    }

    // Checking if the command selected is the spotify command. If it is, we use the Spotify package to make an API request, log it to the console, and add it to the log file with a timestamp.
    // Also, if the user does not put in a search selection, the program automatically selects a default search and logs it.
    if (arg === 'spotify') {
            if (typeof arg2 === 'undefined') {
                spotify.search({type: 'track', query: 'the sign ace of base'}, function(error, data) {
                    if (error) {
                        throw error;
                    }
                    console.log(data.tracks.items[0]);
                    console.log(liriResponse("You wanted Ace of Base, right? No?"));
                    fs.appendFile("log.txt", "\n" +hours + ":" + minutes + ":" + seconds + "---" + "Song Query" + "===" + JSON.stringify(data.tracks.items[0], null, 2), function(error) {
                        if (error) {
                            throw error
                        } 
                    })
                }) 
            } else {

                spotify.search({type: 'track', query: arg2}, function(error, data) {
                    if (error) {
                        throw error;
                    }
                    console.log(data.tracks.items[0]);
                    console.log(liriResponse("Here's the song you wanted!"));
                    fs.appendFile("log.txt", "\n" + hours + ":" + minutes + ":" + seconds + "---" + "Song Query" + "===" + JSON.stringify(data.tracks.items[0], null, 2), function(error) {
                        if (error) {
                            throw error
                        }
                    })
                })
            }
    }

    // Checking if the command selected is the movie find command. If it is, we make a request using the Request package to the OMDB API, log it to the console, and add it to the log file with a timestamp.
    // If the user does not put in a search selection, the program automatically selects a default and logs it.
    if (arg === 'movie') {
            if (typeof arg2 === 'undefined') {
                request("http://www.omdbapi.com/?apikey=c33bdeed&t=mr+nobody", function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(JSON.parse(body, null, 2));
                        console.log(liriResponse("I guess this is what you wanted!"));
                        fs.appendFile("log.txt", "\n" + hours + ":" + minutes + ":" + seconds + "---" + "Movie Query" + "===" + JSON.stringify(body, null, 4), function(error) {
                            if (error) {
                                throw error;
                            }
                        })
                    } else if (error) {
                        throw error;
                    }
                })
            } else {

                request("http://www.omdbapi.com/?apikey=c33bdeed&t=" + arg2, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        console.log(JSON.parse(body, null, 2));
                        console.log(liriResponse("Solid choice!"));
                        fs.appendFile("log.txt", "\n" + hours + ":" + minutes + ":" + seconds + "---" + "Movie Query" + "===" + JSON.stringify(body, null, 2), function(error) {
                            if (error) {
                                throw error;
                            }
                        })
                    } else if (error) {
                        throw error;
                    }
                })
            }
    }
    // If the user selects the "do what it says" command, the program will read the line that is in the random.txt file and execute it.
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

    // If the user selects the remove log file command, the program deletes the log.txt file. If the file doesn't exist, an error will be displayed.
    if (arg === 'remove') {
        fs.unlink('./log.txt', function(error) {
            if (error) {
                throw error
            } else {
                console.log(liriResponse("Log successfully deleted!"));
            }
        })
    }

}


// Here's where the Inquirer package is used. We present the user with a "list" type input where the user can select one of the options.
inquirer.prompt({
    type : 'list',
    name : 'choice',
    message : 'What action would you like me to perform?',
    choices : [
        'Print tweets',
        'Search Spotify for song info',
        'Search OMDB for movie info',
        'Do what it says!',
        'Remove the log file'

    ]
    // After the user selects an option, we check to see which option it was and depending on the option, either ask for more information or pass the command to our LIRI function.
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
    } else if (cmdChoice.choice === 'Remove the log file') {
        liriBot('remove');
    }
})