import express, { NextFunction } from "express";
import Axios from "axios";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import methodOverride from "method-override";

import spotifyRouter from "./spotify/router";
import deezerRouter from "./deezer/router";
import transferRouter from "./transfer/router";

import { authCallback as spotifyCallback } from "./spotify/SpotifyController";

import cors from "cors";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
const port = 3000;

const deezer_app_id = process.env.DEEZER_APP_ID;
const deezer_app_secret = process.env.DEEZER_APP_SECRET;
const deezer_redirect_uri = "http://localhost:3000/callback/deezer";

interface responseParams {
  access_token: string;
  expires: string;
}

function getParams(data: string): responseParams {
  var result = {
    access_token: "",
    expires: "",
  };
  data.split("&").forEach((part) => {
    var item = part.split("=");
    if (item[0] === "access_token" || item[0] === "expires") {
      result[item[0]] = decodeURIComponent(item[1]);
    }
  });
  return result;
}

app.get("/", (req, res) => {
  const cookies = req.cookies;
  res.json({ message: "Hello" });
});

app.get("/success", (req, res) => {
  res.status(200).send("Success !");
});

app.get("/callback", spotifyCallback);

app.get("/deezer-login", (req, res) => {
  res.redirect(
    "https://connect.deezer.com/oauth/auth.php?app_id=" +
      deezer_app_id +
      "&perms=basic_access,email,manage_library&redirect_uri=" +
      deezer_redirect_uri
  );
});

app.get("/callback/deezer", (req, res) => {
  const url: string = `https://connect.deezer.com/oauth/access_token.php?app_id=${deezer_app_id}&secret=${deezer_app_secret}&code=${req.query.code}`;
  Axios.get(url)
    .then((response) => {
      const params: responseParams = getParams(response.data);
      res.cookie("deezer_token", params.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + params.expires),
      });
      Axios.get(
        `http://localhost:3000/deezer/token?access_token=${params.access_token}`
      )
        .then((response) => {
          console.log("access token okay");
        })
        .catch((error) => console.error(error));

      res.cookie("deezer-auth", true);
      res.redirect("http://localhost:4200");
    })
    .catch((error) => {
      console.error(error.response.data);
      res.status(500).send("Something went wrong.");
    });
});

app.use("/spotify", spotifyRouter);
app.use("/deezer", deezerRouter);
app.use("/transfer", transferRouter);

// app.use(methodOverride());

// app.use((err: Error, req: Express.Request, res: any, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});
