import React from "react";
import { useCookies } from "react-cookie";
import { useData } from "../hooks/useData";

const Spotify: React.FC = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["spotify-auth"]);
  return cookie["spotify-auth"] ? (
    <SpotifyConnected />
  ) : (
    <div>
      not connected.
      <a href="http://localhost:3000/spotify/login">connect now</a>
    </div>
  );
};

const SpotifyConnected: React.FC = () => {
  const { data } = useData("http://localhost:3000/spotify/me");

  if (!data) return <div>"Loading..."</div>;

  return (
    <div>
      Connected to Spotify as {data?.display_name ?? ""}
      <br />
      <Playlists />
    </div>
  );
};

const Playlists: React.FC = () => {
  const { data } = useData("http://localhost:3000/spotify/playlists");

  if (!data) return <div>"Loading your playlists..."</div>;

  const playlists = data.items.map((item: any) => {
    return <option value={item}>{item}</option>;
  });

  return (
    <div style={styles.container}>
      <div style={styles.title}>Your playlists:</div>
      <select multiple style={styles.selector} size={data.size}>
        {playlists}
      </select>
    </div>
  );
};

const styles = {
  container: {
    padding: 10,
    display: "flex",
    "flex-direction": "column",
    alignItems: "center",
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 24,
    paddingTop: 24,
  },
  selector: {
    height: "100%",
  },
};

export default React.memo(Spotify);
