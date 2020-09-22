"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var Deezer = axios_1.default.create({
    baseURL: "https://api.deezer.com",
});
var router = express_1.default();
router.get("/", function (req, res) {
    res.status(200).send("ok");
});
router.get("/token", function (req, res) {
    var access_token = typeof req.query.access_token === "string"
        ? req.query.access_token
        : "";
    Deezer.defaults.params = {};
    Deezer.defaults.params["access_token"] = access_token;
    res.status(200).send("Connected to Deezer !");
});
router.get("/liked", function (req, res) {
    Deezer.get("/user/me/tracks")
        .then(function (response) {
        res.send(response.data);
    })
        .catch(function (error) {
        console.error(error.response.data);
        res.status(400).send("OOps");
    });
});
router.post("/add", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tracks, n, i, track, searchParam, data, response, id, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tracks = req.body.tracks;
                n = tracks.length;
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < n)) return [3 /*break*/, 10];
                track = tracks[n - 1 - i];
                console.log("Transfering title: " + track.title);
                searchParam = encodeURIComponent("track:\"" + track.title + "\" artist:\"" + track.artist + "\" album:\"" + track.album + "\"");
                _a.label = 2;
            case 2:
                _a.trys.push([2, 8, , 9]);
                data = void 0;
                return [4 /*yield*/, Deezer.get("/search?q=" + searchParam)];
            case 3:
                response = _a.sent();
                if (!response) return [3 /*break*/, 4];
                data = response.data;
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, Deezer.get("/search?q=" + encodeURIComponent('track:"' + track.title.replace(/[0-9]/g, "") + '"'))];
            case 5:
                data = (_a.sent()).data;
                _a.label = 6;
            case 6:
                id = data.data[0].id;
                return [4 /*yield*/, Deezer.get("/user/me/tracks?request_method=POST&track_id=" + id)];
            case 7:
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.error("Error with title : " + track.title);
                return [3 /*break*/, 9];
            case 9:
                i++;
                return [3 /*break*/, 1];
            case 10:
                res.status(200).send("tracks added !");
                return [2 /*return*/];
        }
    });
}); });
router.post("/add_playlist", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playlist, n, deezerPlaylistId, i, track, searchParam, data, newSearchParam, id, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                playlist = req.body.playlist;
                n = playlist.items.length;
                console.log("Transfering playlist: " + playlist.name);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, Deezer.get("/user/me/playlists?title=" + encodeURIComponent(playlist.name) + "&request_method=POST")];
            case 2:
                deezerPlaylistId = (_a.sent()).data.id;
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < n)) return [3 /*break*/, 9];
                track = playlist.items[n - 1 - i];
                console.log("Transfering title: " + track.title);
                searchParam = encodeURIComponent("track:\"" + track.title + "\" artist:\"" + track.artist + "\" album:\"" + track.album + "\"");
                return [4 /*yield*/, Deezer.get("/search?q=" + searchParam)];
            case 4:
                data = (_a.sent()).data;
                if (!(data.total === 0)) return [3 /*break*/, 6];
                newSearchParam = encodeURIComponent("track:\"" + track.title + "\"");
                return [4 /*yield*/, Deezer.get("/search?q=" + newSearchParam)];
            case 5:
                data = (_a.sent()).data;
                _a.label = 6;
            case 6:
                if (data.total === 0) {
                    console.error("Error transferring title : " + track.title);
                    return [3 /*break*/, 8];
                }
                id = data.data[0].id;
                return [4 /*yield*/, Deezer.get("/playlists/" + deezerPlaylistId + "/tracks?request_method=POST&songs=" + id)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 3];
            case 9: return [3 /*break*/, 11];
            case 10:
                error_2 = _a.sent();
                console.log(error_2.response ? error_2.response.data : error_2);
                throw new Error("Unable to transfer playlist");
            case 11:
                res.status(200).send("youpi");
                return [2 /*return*/];
        }
    });
}); });
exports.default = router;
