const express = require('express');
const hbs = require('hbs');
require('dotenv').config();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
let spotifyApi = new SpotifyWebApi({
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')

})

app.get('/artists', (req, res) => {
    const artistSelected = req.query.artist;
    spotifyApi
        .searchArtists(artistSelected)
        .then(data => {
            let artists = data.body.artists.items;
            res.render('artists', {
                artists,
                artistSelected
            })
        })
        .catch(err => console.log(`The error while searching artists occured: `, err))


})

app.get('/albums/:id', (req, res) => {
    const artistId = req.params.id;
    spotifyApi.getArtistAlbums(artistId)
        .then(dataFromApi => {
            let albums = dataFromApi.body.items;
            res.render('albums', {
                albums,
            })

        }).catch((err => {
            console.log(`There was an error retrieving the albums from the API. Error:${err}`)
        }))
})
app.get('/tracks/:name/:id', (req, res) => {
    const albumName = req.params.name
    const albumID = req.params.id;
    spotifyApi.getAlbumTracks(albumID)
        .then(dataFromApi => {
            let tracks = dataFromApi.body.items;
            res.render('tracks', {
                tracks,
                albumID,
                albumName
            })

        }).catch((err => {
            console.log(`There was an error retrieving the albums from the API. Error:${err}`)
        }))
})
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));