import express from "express";
import Axios from "axios";

import { Playlist, Track } from "../types";

const router = express();

router.get("/:source/:destination", async (req, res) => {
    const source = req.params.source;
    const destination = req.params.destination;
    let tracks: Track[] = [];
    switch (source) {
        case "Spotify":
        case "spotify":
            const { data } = await Axios.get(
                "http://localhost:3000/spotify/liked"
            );
            tracks = data.tracks;
            break;
        default:
            res.status(400).send("Unrecognized source");
    }
    console.log(tracks);
    switch (destination) {
        case "Deezer":
        case "deezer":
            try {
                await Axios.post("http://localhost:3000/deezer/add", {
                    tracks: tracks,
                });
                res.status(200).send("ca a peut etre marché mdr");
            } catch (error) {
                console.log(error.response.data);
                res.status(400).send("oops");
            }
            break;
        default:
            res.status(400).send("Unrecognized destination");
    }
});

router.get("/playlist/:source/:destination", async (req, res) => {
    const source = req.params.source;
    const destination = req.params.destination;
    let playlists: Playlist[] = [];
    switch (source) {
        case "Spotify":
        case "spotify":
            const { data } = await Axios.get(
                "http://localhost:3000/spotify/playlists"
            );
            playlists = data.items;
            break;
        default:
            res.status(400).send("Unrecognized source");
    }
    switch (destination) {
        case "Deezer":
        case "deezer":
            try {
                for (let i = 12; i < playlists.length; i++) {
                    await Axios.post(
                        "http://localhost:3000/deezer/add_playlist",
                        {
                            playlist: playlists[i],
                        }
                    );
                }
                res.status(200).send("ca a peut etre marché mdr");
            } catch (error) {
                console.log(error.response ? error.response.data : error);
                res.status(400).send("oops");
            }
            break;
        default:
            res.status(400).send("Unrecognized destination");
    }
});
export default router;
