import express from "express";
import Axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import spotifyRouter from "./spotify/router";
import deezerRouter from "./deezer/router";
import transferRouter from "./transfer/router";

dotenv.config();

const app: express.Application = express();
app.use(cookieParser());
app.use(bodyParser.json());
const port = 3000;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const scopes = "user-library-read playlist-read-private user-read-private";
const redirect_uri = "http://localhost:3000/callback";

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
    console.log(cookies);
    res.send("Hello");
});

app.get("/success", (req, res) => {
    res.status(200).send("Success !");
});

app.get("/spotify-login", (req, res) => {
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
});

app.get("/deezer-login", (req, res) => {
    res.redirect(
        "https://connect.deezer.com/oauth/auth.php?app_id=" +
            deezer_app_id +
            "&perms=basic_access,email,manage_library&redirect_uri=" +
            deezer_redirect_uri
    );
});

app.get("/callback", (req, res) => {
    const base64data = Buffer.from(`${client_id}:${client_secret}`).toString(
        "base64"
    );
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

            res.redirect("/success");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("something went wrong.");
        });
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

            res.redirect("/success");
        })
        .catch((error) => {
            console.error(error.response.data);
            res.status(500).send("Something went wrong.");
        });
});

app.use("/spotify", spotifyRouter);
app.use("/deezer", deezerRouter);
app.use("/transfer", transferRouter);

app.listen(port, () => {
    console.log(`Listening from port ${port}`);
});
