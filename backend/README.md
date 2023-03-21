# migrator
A simple migrator to transfer music from one streaming platform to another, written in Node.js.

So far, only the transfer from Spotify to Deezer is implemented.
The project is only a backend right now, but a front-end could easily be plugged on it

**Careful** : The OAuth tokens are not encrypted and stored as cookies. Watch out for them :)

## How to use

1. Connect your Spotify account by visiting `http://localhost:3000/spotify-login`
2. Connect your Deezer account by visiting `http://localhost:3000/deezer-login`
3. Transfer your Liked title from SPotify to Deezer by visiting `http://localhost:3000/transfer/spotify/deezer`
4. Transfer your Playlists from Spotify to Deezer by visiting `http://localhost:3000/transfer/playlists/spotify/deezer`x
