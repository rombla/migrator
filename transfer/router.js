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
var router = express_1.default();
router.get("/:source/:destination", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var source, destination, tracks, _a, data, _b, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                source = req.params.source;
                destination = req.params.destination;
                tracks = [];
                _a = source;
                switch (_a) {
                    case "Spotify": return [3 /*break*/, 1];
                    case "spotify": return [3 /*break*/, 1];
                }
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, axios_1.default.get("http://localhost:3000/spotify/liked")];
            case 2:
                data = (_c.sent()).data;
                tracks = data.tracks;
                return [3 /*break*/, 4];
            case 3:
                res.status(400).send("Unrecognized source");
                _c.label = 4;
            case 4:
                console.log(tracks);
                _b = destination;
                switch (_b) {
                    case "Deezer": return [3 /*break*/, 5];
                    case "deezer": return [3 /*break*/, 5];
                }
                return [3 /*break*/, 9];
            case 5:
                _c.trys.push([5, 7, , 8]);
                return [4 /*yield*/, axios_1.default.post("http://localhost:3000/deezer/add", {
                        tracks: tracks,
                    })];
            case 6:
                _c.sent();
                res.status(200).send("ca a peut etre marché mdr");
                return [3 /*break*/, 8];
            case 7:
                error_1 = _c.sent();
                console.log(error_1.response.data);
                res.status(400).send("oops");
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(400).send("Unrecognized destination");
                _c.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
router.get("/playlist/:source/:destination", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var source, destination, playlists, _a, data, _b, i, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                source = req.params.source;
                destination = req.params.destination;
                playlists = [];
                _a = source;
                switch (_a) {
                    case "Spotify": return [3 /*break*/, 1];
                    case "spotify": return [3 /*break*/, 1];
                }
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, axios_1.default.get("http://localhost:3000/spotify/playlists")];
            case 2:
                data = (_c.sent()).data;
                playlists = data.items;
                return [3 /*break*/, 4];
            case 3:
                res.status(400).send("Unrecognized source");
                _c.label = 4;
            case 4:
                _b = destination;
                switch (_b) {
                    case "Deezer": return [3 /*break*/, 5];
                    case "deezer": return [3 /*break*/, 5];
                }
                return [3 /*break*/, 12];
            case 5:
                _c.trys.push([5, 10, , 11]);
                i = 12;
                _c.label = 6;
            case 6:
                if (!(i < playlists.length)) return [3 /*break*/, 9];
                return [4 /*yield*/, axios_1.default.post("http://localhost:3000/deezer/add_playlist", {
                        playlist: playlists[i],
                    })];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9:
                res.status(200).send("ca a peut etre marché mdr");
                return [3 /*break*/, 11];
            case 10:
                error_2 = _c.sent();
                console.log(error_2.response ? error_2.response.data : error_2);
                res.status(400).send("oops");
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(400).send("Unrecognized destination");
                _c.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
