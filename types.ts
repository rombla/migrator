interface Track {
    title: string;
    album: string;
    artist: string;
}

interface Playlist {
    name: string;
    items: Track[];
}

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

export { Track, Playlist, SpotifyTrack, SpotifyTracksList };
