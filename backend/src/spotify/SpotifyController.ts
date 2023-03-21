import Axios, { AxiosError, AxiosInstance } from "axios";
import querystring from "querystring";
import express, { NextFunction } from "express";
import dotenv from "dotenv";

import {
  Track,
  Playlist,
  SpotifyTrack,
  SpotifyTracksList,
  ApiError,
} from "../types";

dotenv.config();

const SpotifyRouter = Axios.create({
  baseURL: "https://api.spotify.com/v1",
});
SpotifyRouter.interceptors.response.use(undefined, (error: AxiosError) => {
  if (401 === error.response?.status) {
    return Promise.reject(new Error(ApiError.UNAUTHORIZED));
  } else {
    return Promise.reject(error);
  }
});

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const scopes = "user-library-read playlist-read-private user-read-private";
const redirect_uri = "http://localhost:3000/callback";

function connect(req: express.Request, res: express.Response): void {
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      client_id +
      "&scope=" +
      encodeURIComponent(scopes) +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri)
  );
}

function authCallback(req: express.Request, res: express.Response): void {
  let code = req.query.code;
  if (typeof code !== "string") {
    code = "";
    console.error("something wrong with the code");
  }
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  Axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
      client_id: client_id,
      client_secret: client_secret,
    }),
    config
  )
    .then((response) => {
      let { data } = response;
      res.cookie("spotify-token", data.access_token, {
        expires: new Date(Date.now() + data.expires_in),
        httpOnly: true,
      });
      res.cookie("spotify-refresh-token", data.refresh_token, {
        httpOnly: true,
      });

      Axios.get(
        `http://localhost:3000/spotify/token?access_token=${data.access_token}`
      )
        .then(() => {
          console.log("access token okay");
        })
        .catch((error) => console.error(error));

      res.cookie("spotify-auth", true);
      // res.json({ connected: "ok", token: data.access_token });
      res.redirect("http://localhost:4200");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("something went wrong.");
    });
}

function setToken(req: express.Request, res: express.Response): void {
  const access_token =
    typeof req.query.access_token === "string" ? req.query.access_token : "";
  SpotifyRouter.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${access_token}`;
  res.status(200).send("Connected to Spotify !");
}

function getMe(req: express.Request, res: express.Response) {
  SpotifyRouter.get("/me")
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getPlaylistsNames(
  req: Express.Request,
  res: any,
  next: NextFunction
) {
  try {
    const { data } = await SpotifyRouter.get("/me/playlists?limit=50");
    const items = data.items;
    res.json({ items: items.map(({ name }: { name: string }) => name) });
  } catch (err) {
    next(err);
  }
}

async function getPlaylistsFull(req: express.Request, res: express.Response) {
  let playlists: Playlist[] = [];
  try {
    const { data } = await SpotifyRouter.get("/me/playlists?limit=50");
    const items = data.items;
    const n = data.total;
    for (let i = 0; i < n; i++) {
      const { items: tracks } = (await SpotifyRouter.get(items[i].tracks.href))
        .data;
      let playlist_tracks: Track[] = [];
      tracks.forEach(({ track }: { track: SpotifyTrack }) => {
        playlist_tracks.push({
          title: track.name,
          album: track.album.name,
          artist: track.artists[0].name,
        });
      });
      playlists.push({
        name: items[i].name,
        items: playlist_tracks,
      });
    }
    res.status(200).json({
      status: 200,
      items: playlists,
    });
  } catch (error: any) {
    console.error(error.response ? error.response.data : error);
    res.status(400).send("oops");
  }
}

async function getLiked(req: express.Request, res: express.Response) {
  let tracks: Track[] = [];
  let total = 1;
  let next = "https://api.spotify.com/v1/me/tracks";
  while (tracks.length < total) {
    try {
      const { data } = await SpotifyRouter.get(next);
      next = data.next;
      total = data.total;
      const spotifyTracks: SpotifyTracksList[] = data.items;
      spotifyTracks.forEach((track) => {
        tracks.push({
          title: track.track.name,
          artist: track.track.artists[0].name,
          album: track.track.album.name,
        });
      });
    } catch (error: any) {
      console.log(error.response.data);
      res.status(500).send("Something went wrong.");
    }
  }
  res.status(200).json({ status: 200, tracks: tracks });
}

export {
  connect,
  authCallback,
  setToken,
  getLiked,
  getMe,
  getPlaylistsNames,
  getPlaylistsFull,
};
