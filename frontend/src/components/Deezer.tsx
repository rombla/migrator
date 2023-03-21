import React from "react";
import { useCookies } from "react-cookie";

const Deezer: React.FC = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["deezer-auth"]);
  return cookie["deezer-auth"] ? (
    <div> Connected !</div>
  ) : (
    <div>
      not connected.
      <a href="http://localhost:3000/deezer-login">connect now</a>
    </div>
  );
};

export default React.memo(Deezer);
