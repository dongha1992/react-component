import React, {
  createContext,
  Reducer,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
} from "../Async/util/pokemon";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import { useAsync } from "../hooks/useAsync";

const PokemonCacheContext = createContext<any>(null);

function pokemonCacheReducer(state: any, action: any) {
  switch (action.type) {
    case "ADD_POKEMON": {
      return { ...state, [action.pokemonName]: action.pokemonData };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function PokemonCacheProvider(props: any) {
  const [cache, dispatch] = React.useReducer(pokemonCacheReducer, {});
  return <PokemonCacheContext.Provider value={[cache, dispatch]} {...props} />;
}

function usePokemonCache() {
  const context = React.useContext(PokemonCacheContext);
  if (!context) {
    throw new Error(
      "usePokemonCache must be used within a PokemonCacheProvider"
    );
  }
  return context;
}

function PokemonInfo({
  pokemonName: externalPokemonName,
}: {
  pokemonName: string;
}) {
  const [cache, dispatch] = usePokemonCache();
  const pokemonName = externalPokemonName?.toLowerCase();
  const {
    data: pokemon,
    status,
    error,
    run,
    setData,
  } = useAsync({
    status: pokemonName ? "pending" : "idle",
  });

  useEffect(() => {
    if (!pokemonName) return;
    else if (cache[pokemonName]) {
      setData(cache[pokemonName]);
    } else {
      return run(
        fetchPokemon(pokemonName).then((pokemonData) => {
          console.log("work");
          dispatch({ type: "ADD_POKEMON", pokemonName, pokemonData });
          return pokemonData;
        })
      );
    }
  }, [cache, dispatch, pokemonName, run, setData]);

  switch (status) {
    case "idle":
      return <span>Submit a pokemon</span>;
    case "pending":
      return <PokemonInfoFallback name={pokemonName} />;
    case "rejected":
      throw error;
    case "resolved":
      return <PokemonDataView pokemon={pokemon} />;
    default:
      // 에러 바운드에서 에러 캐치
      throw new Error("This should be impossible");
  }
}

function PreviousPokemon({ onSelect }: any) {
  const [cache] = usePokemonCache();
  return (
    <div>
      Previous Pokemon
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {Object.keys(cache).map((pokemonName) => (
          <li key={pokemonName} style={{ margin: "4px auto" }}>
            <button
              style={{ width: "100%" }}
              onClick={() => onSelect(pokemonName)}
            >
              {pokemonName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PokemonSection({ onSelect, pokemonName }: any) {
  return (
    <PokemonCacheProvider>
      <div style={{ display: "flex" }}>
        <PreviousPokemon onSelect={onSelect} />
        <div className="pokemon-info">
          <ErrorBoundary
            onReset={() => onSelect("")}
            resetKeys={[pokemonName]}
            fallbackRender={ErrorFallback}
          >
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
      </div>
    </PokemonCacheProvider>
  );
}

function Pokemon() {
  const [pokemonName, setPokemonName] = useState("");

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  function handleSelect(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonSection onSelect={handleSelect} pokemonName={pokemonName} />
    </div>
  );
}

export default Pokemon;

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      There was an error:{" "}
      <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
