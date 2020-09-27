import Axios, { AxiosInstance } from "axios";
import express from "express";

import { Track, Playlist, SpotifyTrack, SpotifyTracksList } from "../types";

const SpotifyRouter = Axios.create({
    baseURL: "https://api.spotify.com/v1",
});

function setToken(req: express.Request, res: express.Response): void {
    const access_token =
        typeof req.query.access_token === "string"
            ? req.query.access_token
            : "";
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

async function getPlaylists(req: express.Request, res: express.Response) {
    let playlists: Playlist[] = [];
    try {
        const { data } = await SpotifyRouter.get("/me/playlists?limit=50");
        const items = data.items;
        const n = data.total;
        for (let i = 0; i < n; i++) {
            const { items: tracks } = (
                await SpotifyRouter.get(items[i].tracks.href)
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
        } catch (error) {
            console.log(error.response.data);
            res.status(500).send("Something went wrong.");
        }
    }
    res.status(200).json({ status: 200, tracks: tracks });
}

export { setToken, getLiked, getMe, getPlaylists };
