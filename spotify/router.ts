import express from "express";
import Axios from "axios";

import { Track, Playlist } from "../types";

interface SpotifyTrack {
    album: any;
    artists: any;
    available_markets: any;
    disc_number: Number;
    duration_ms: Number;
    explicit: boolean;
    external_ids: any;
    external_urls: any;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: any;
    restrictions: any;
    name: string;
    popularity: Number;
    preview_url: string;
    track_number: Number;
    type: string;
    uri: string;
    is_local: boolean;
}

interface SpotifyTracksList {
    added_at: Date;
    track: SpotifyTrack;
}

const Spotify = Axios.create({
    baseURL: "https://api.spotify.com/v1",
});
// Spotify.defaults.headers.common['Authorization']

const router = express();

router.get("/", (req, res) => {
    res.status(200).send("ok");
});

router.get("/token", (req, res) => {
    const access_token =
        typeof req.query.access_token === "string"
            ? req.query.access_token
            : "";
    Spotify.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    res.status(200).send("Connected to Spotify !");
});

router.get("/me", (req, res) => {
    console.log(Spotify.defaults.headers);
    Spotify.get("/me")
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
});

router.get("/playlists", async (req, res) => {
    let playlists: Playlist[] = [];
    try {
        const { data } = await Spotify.get("/me/playlists?limit=50");
        const items = data.items;
        const n = data.total;
        for (let i = 0; i < n; i++) {
            const { items: tracks } = (
                await Spotify.get(items[i].tracks.href)
            ).data;
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
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(400).send("oops");
    }
});

router.get("/liked", async (req, res) => {
    let tracks: Track[] = [];
    let total = 1;
    let next = "https://api.spotify.com/v1/me/tracks";
    while (tracks.length < total) {
        try {
            const { data } = await Spotify.get(next);
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
        } catch (error) {
            console.log(error.response.data);
            res.status(500).send("Something went wrong.");
        }
    }
    res.status(200).json({ status: 200, tracks: tracks });
});

export default router;
