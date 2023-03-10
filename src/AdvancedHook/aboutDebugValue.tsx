import * as React from "react";

const formatDebugValue = ({ query, state }: any) => `\`${query}\` => ${state}`;

function useMedia(query: any, initialState: boolean = false) {
  const [state, setState] = React.useState(initialState);
  React.useDebugValue({ query, state }, formatDebugValue);

  React.useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    function onChange() {
      if (!mounted) {
        return;
      }
      setState(Boolean(mql.matches));
    }

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
}

function Box() {
  const isBig = useMedia("(min-width: 1000px)");
  const isMedium = useMedia("(max-width: 999px) and (min-width: 700px)");
  const isSmall = useMedia("(max-width: 699px)");
  const color: any = isBig
    ? "green"
    : isMedium
    ? "yellow"
    : isSmall
    ? "red"
    : null;

  return <div style={{ width: 200, height: 200, backgroundColor: color }} />;
}

function AboutDebugValue() {
  return <Box />;
}

export default AboutDebugValue;
