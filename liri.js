require("dotenv").config();
let keys = require('./keys');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request');

let client = new Twitter(keys.twitter);
let spotify = new Spotify(keys.spotify);