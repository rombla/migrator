"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var querystring_1 = __importDefault(require("querystring"));
var dotenv_1 = __importDefault(require("dotenv"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var router_1 = __importDefault(require("./spotify/router"));
var router_2 = __importDefault(require("./deezer/router"));
var router_3 = __importDefault(require("./transfer/router"));
dotenv_1.default.config();
var app = express_1.default();
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.json());
var port = 3000;
var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var scopes = "user-library-read playlist-read-private user-read-private";
var redirect_uri = "http://localhost:3000/callback";
var deezer_app_id = process.env.DEEZER_APP_ID;
var deezer_app_secret = process.env.DEEZER_APP_SECRET;
var deezer_redirect_uri = "http://localhost:3000/callback/deezer";
function getParams(data) {
    var result = {
        access_token: "",
        expires: "",
    };
    data.split("&").forEach(function (part) {
        var item = part.split("=");
        if (item[0] === "access_token" || item[0] === "expires") {
            result[item[0]] = decodeURIComponent(item[1]);
        }
    });
    return result;
}
app.get("/", function (req, res) {
    var cookies = req.cookies;
    console.log(cookies);
    res.send("Hello");
});
app.get("/success", function (req, res) {
    res.status(200).send("Success !");
});
app.get("/spotify-login", function (req, res) {
    res.redirect("https://accounts.spotify.com/authorize" +
        "?response_type=code" +
        "&client_id=" +
        client_id +
        "&scope=" +
        encodeURIComponent(scopes) +
        "&redirect_uri=" +
        encodeURIComponent(redirect_uri));
});
app.get("/deezer-login", function (req, res) {
    res.redirect("https://connect.deezer.com/oauth/auth.php?app_id=" +
        deezer_app_id +
        "&perms=basic_access,email,manage_library&redirect_uri=" +
        deezer_redirect_uri);
});
app.get("/callback", function (req, res) {
    var base64data = Buffer.from(client_id + ":" + client_secret).toString("base64");
    var code = req.query.code;
    if (typeof code !== "string") {
        code = "";
        console.error("something wrong with the code");
    }
    var config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    axios_1.default.post("https://accounts.spotify.com/api/token", querystring_1.default.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
    }), config)
        .then(function (response) {
        var data = response.data;
        res.cookie("spotify-token", data.access_token, {
            expires: new Date(Date.now() + data.expires_in),
            httpOnly: true,
        });
        res.cookie("spotify-refresh-token", data.refresh_token, {
            httpOnly: true,
        });
        axios_1.default.get("http://localhost:3000/spotify/token?access_token=" + data.access_token)
            .then(function () {
            console.log("access token okay");
        })
            .catch(function (error) { return console.error(error); });
        res.redirect("/success");
    })
        .catch(function (err) {
        console.error(err);
        res.status(500).send("something went wrong.");
    });
});
app.get("/callback/deezer", function (req, res) {
    var url = "https://connect.deezer.com/oauth/access_token.php?app_id=" + deezer_app_id + "&secret=" + deezer_app_secret + "&code=" + req.query.code;
    axios_1.default.get(url)
        .then(function (response) {
        var params = getParams(response.data);
        res.cookie("deezer_token", params.access_token, {
            httpOnly: true,
            expires: new Date(Date.now() + params.expires),
        });
        axios_1.default.get("http://localhost:3000/deezer/token?access_token=" + params.access_token)
            .then(function (response) {
            console.log("access token okay");
        })
            .catch(function (error) { return console.error(error); });
        res.redirect("/success");
    })
        .catch(function (error) {
        console.error(error.response.data);
        res.status(500).send("Something went wrong.");
    });
});
app.use("/spotify", router_1.default);
app.use("/deezer", router_2.default);
app.use("/transfer", router_3.default);
app.listen(port, function () {
    console.log("Listening from port " + port);
});
