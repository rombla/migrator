interface Track {
    title: string;
    album: string;
    artist: string;
}

interface Playlist {
    name: string;
    items: Track[];
}

export { Track, Playlist };
