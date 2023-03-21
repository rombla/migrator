import express from "express";
import Axios, { AxiosError } from "axios";

import { Playlist, Track } from "../types";

const Deezer = Axios.create({
  baseURL: "https://api.deezer.com",
});

const router = express();

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

router.get("/token", (req, res) => {
  const access_token =
    typeof req.query.access_token === "string" ? req.query.access_token : "";
  Deezer.defaults.params = {};
  Deezer.defaults.params["access_token"] = access_token;
  res.status(200).send("Connected to Deezer !");
});

router.get("/liked", (req, res) => {
  Deezer.get("/user/me/tracks")
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error.response.data);
      res.status(400).send("OOps");
    });
});

router.post("/add", async (req, res) => {
  const tracks: Track[] = req.body.tracks;
  const n = tracks.length;

  for (let i = 0; i < n; i++) {
    const track = tracks[n - 1 - i];
    console.log(`Transfering title: ${track.title}`);
    const searchParam = encodeURIComponent(
      `track:"${track.title}" artist:"${track.artist}" album:"${track.album}"`
    );
    try {
      let data: any;
      const response = await Deezer.get(`/search?q=${searchParam}`);
      if (response) {
        data = response.data;
      } else {
        data = (
          await Deezer.get(
            `/search?q=${encodeURIComponent(
              'track:"' + track.title.replace(/[0-9]/g, "") + '"'
            )}`
          )
        ).data;
      }

      const { id } = data.data[0];
      await Deezer.get(`/user/me/tracks?request_method=POST&track_id=${id}`);
    } catch (error) {
      console.error(`Error with title : ${track.title}`);
    }
  }
  res.status(200).send("tracks added !");
});

router.post("/add_playlist", async (req, res) => {
  const playlist: Playlist = req.body.playlist;
  const n = playlist.items.length;
  console.log(`Transfering playlist: ${playlist.name}`);
  try {
    const { id: deezerPlaylistId } = (
      await Deezer.get(
        `/user/me/playlists?title=${encodeURIComponent(
          playlist.name
        )}&request_method=POST`
      )
    ).data;
    for (let i = 0; i < n; i++) {
      const track = playlist.items[n - 1 - i];
      console.log(`Transfering title: ${track.title}`);
      const searchParam = encodeURIComponent(
        `track:"${track.title}" artist:"${track.artist}" album:"${track.album}"`
      );
      let { data } = await Deezer.get(`/search?q=${searchParam}`);

      if (data.total === 0) {
        const newSearchParam = encodeURIComponent(`track:"${track.title}"`);
        data = (await Deezer.get(`/search?q=${newSearchParam}`)).data;
      }

      if (data.total === 0) {
        console.error(`Error transferring title : ${track.title}`);
        continue;
      }
      const { id } = data.data[0];

      await Deezer.get(
        `/playlist/${deezerPlaylistId}/tracks?request_method=POST&songs=${id}`
      );
    }
  } catch (error: any) {
    console.log(error.response ? error.response.data : error);
    throw new Error("Unable to transfer playlist");
  }
  res.status(200).send("youpi");
});
export default router;
