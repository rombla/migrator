import React from "react";
import Deezer from "./Deezer";
import Selector from "./Selector";
import Spotify from "./Spotify";

export enum Player {
  SPOTIFY = 1,
  DEEZER = 2,
}

const Home: React.FC = () => {
  const [leftPanel, setLeftPanel] = React.useState<Player | null>(null);
  const [rightPanel, setRightPanel] = React.useState<Player | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.title}> What will you transfer today ?</div>
      <div style={styles.body}>
        <div style={styles.panel}>
          {leftPanel ? (
            <Spotify />
          ) : (
            <Selector dest="from" setPlayer={setLeftPanel} />
          )}
        </div>
        <div style={styles.divider} />
        <div style={styles.panel}>
          {rightPanel ? (
            <Deezer />
          ) : (
            <Selector dest="to" setPlayer={setRightPanel} />
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "25px",
    paddingBottom: "25px",
    fontFamily: "Roboto",
    fontSize: "24px",
  },
  body: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
  },
  divider: {
    border: "1px solid black",
    height: "100%",
    width: 0,
  },
  panel: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
  },
};

export default React.memo(Home);
