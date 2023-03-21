import React from "react";

export const useData = (url: string): { data: any } => {
  const [state, setState] = React.useState();

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await (await fetch(url)).json();

      setState(data);
    };

    fetchData();
  }, [url]);

  return { data: state };
};
