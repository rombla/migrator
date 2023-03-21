import express, { NextFunction } from "express";
import * as Spotify from "./SpotifyController";

const router = express();

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

router.get("/login", Spotify.connect);

router.get("/callback", Spotify.authCallback);

router.get("/token", Spotify.setToken);

router.get("/me", Spotify.getMe);

router.get("/playlists", Spotify.getPlaylistsNames);

router.get("/playlists_full", Spotify.getPlaylistsFull);

router.get("/liked", Spotify.getLiked);

export default router;
