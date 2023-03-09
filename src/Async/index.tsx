import { useEffect, useState } from "react";
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
} from "./util/pokemon";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

function PokemonInfo({ pokemonName }: { pokemonName: string }) {
  const [state, setState] = useState<any>({
    status: pokemonName ? "pending" : "idle",
    pokemon: null,
    error: null,
  });

  const { status, pokemon, error } = state;

  useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({ status: "pending" });
    fetchPokemon(pokemonName).then(
      (pokemon) => {
        setState({ status: "resolved", pokemon });
      },
      (error) => {
        setState({ status: "rejected", error });
      }
    );
  }, [pokemonName]);

  if (status === "idle") {
    return <div>"Submit a pokemon"</div>;
  } else if (status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === "rejected") {
    throw error;
  } else if (status === "resolved") {
    return <PokemonDataView pokemon={pokemon} />;
  }
  // 에러 바운더리에서 에러 캐치
  throw new Error("This should be impossible");
}

function Pokemon() {
  const [pokemonName, setPokemonName] = useState("");

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  const handleReset = () => {
    setPokemonName("");
  };

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          fallbackRender={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Pokemon;

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      There was an error:{" "}
      <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
