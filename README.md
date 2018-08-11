# LiriBOT

This is a small command line "bot" using Node.js. It can:

* Read first 20 tweets of specified Twitter screen name (currently twitterapi)
  * **Command Syntax:** "node liri.js my-tweets"
  ![Tweet Demo](assets/tweetdemo.gif)
* Search for a specified song from the Spotify API
  * **Command Syntax:** "node liri.js spotify-this-song 'SONG-NAME-HERE'"
  ![Spotify Demo](assets/spotifydemo.gif)
* Search for a specified movie from the OMDB API
  * **Command Syntax:** "node liri.js movie-this 'MOVIE-NAME-HERE'"
  ![Movie Demo](assets/moviedemo.gif)
* Execute one random command placed into the random.txt file
  * **Command Syntax:** "node liri.js do-what-it-says"
  ![Random Demo](assets/randomdemo.gif)

*You will need to provide your own API keys for requests.*

*Node Packages Used:*
DotEnv
Twitter
Node-Spotify-API
Request