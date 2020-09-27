import express from "express";
import * as Spotify from "./SpotifyController";

const router = express();

router.get("/", (req, res) => {
    res.status(200).send("ok");
});

router.get("/token", Spotify.setToken);

router.get("/me", Spotify.getMe);

router.get("/playlists", Spotify.getPlaylists);

router.get("/liked", Spotify.getLiked);

export default router;
