import { useEffect, useState } from "react";
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from "./util/pokemon";
import "./index.css";

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

  if (error) {
    return <div>error</div>;
  } else if (status === "idle") {
    return <div>"Submit a pokemon"</div>;
  } else if (status === "pending") {
    return <PokemonInfoFallback name={pokemonName} />;
  } else if (status === "rejected") {
    throw error;
  } else if (status === "resolved") {
    return <PokemonDataView pokemon={pokemon} />;
  }
  throw new Error("This should be impossible");
}

function Pokemon() {
  const [pokemonName, setPokemonName] = useState("");

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
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
