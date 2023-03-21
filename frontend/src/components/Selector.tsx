import React from "react";
import { Player } from "./Home";

interface SelectorProps {
  dest: "to" | "from";
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const Selector: React.FC<SelectorProps> = ({ dest, setPlayer }) => {
  return (
    <div style={styles.container}>
      <div style={styles.title}>Where will you transfer your music {dest}?</div>
      <div style={styles.choicePanel}>
        <SelectorChoice
          color="#1DB954"
          textColor="#191414"
          text="Spotify"
          iconHref="https://spotify.com/favicon.ico"
          onClick={() => setPlayer(Player.SPOTIFY)}
        />
        <SelectorChoice
          color="#E16169"
          text="Deezer"
          iconHref="https://deezer.com/favicon.ico"
          onClick={() => setPlayer(Player.DEEZER)}
        />
      </div>
    </div>
  );
};

interface SelectorChoiceProps {
  color: string;
  text: string;
  iconHref?: string;
  textColor?: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const SelectorChoice: React.FC<SelectorChoiceProps> = ({
  color,
  text,
  iconHref,
  textColor,
  onClick,
}) => {
  return (
    <div
      style={{
        ...styles.button,
        border: `1px solid ${color}`,
        backgroundColor: color,
      }}
      onClick={onClick}
    >
      {iconHref ? (
        <img
          src={iconHref}
          alt="logo"
          style={{ maxWidth: 32, maxHeight: 32 }}
        />
      ) : null}
      <nav style={{ color: textColor ?? "black" }}>{text}</nav>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    "flex-direction": "column",
    gap: "5px",
  },
  title: {
    fontFamily: "Roboto",
    fontSize: "18px",
    fontWeight: "bold",
  },
  choicePanel: {
    display: "flex",
    "flex-direction": "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexGrow: 1 / 2,
  },
  button: {
    padding: "5px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};

export default React.memo(Selector);
