import { Suspense, useEffect, useState, useTransition } from "react";
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary as ErrorBoundary,
} from "../Async/util/pokemon";
import { createResource } from "./util";
import "./index.css";
interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

function PokemonInfo({ pokemonResource }: any): any {
  const pokemon = pokemonResource.read();
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  );
}

function getResource(name: string): { read: () => PokemonData } {
  return createResource(fetchPokemon(name));
}

function RenderAsYouFetch() {
  const [pokemonName, setPokemonName] = useState<string>("");
  const [pokemonResource, setPokemonResource] = useState<{
    read: () => PokemonData;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null);
      return;
    }
    startTransition(() => {
      setPokemonResource(getResource(pokemonName));
    });
  }, [pokemonName, startTransition]);

  console.log(isPending, "useTransition의 isPending");

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName("");
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? `pokemon-loading` : ""}`}>
        {pokemonResource ? (
          <ErrorBoundary onReset={handleReset} resetKeys={[pokemonResource]}>
            <Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
              <PokemonInfo pokemonResource={pokemonResource} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <span>이름을 입력해주세요</span>
        )}
      </div>
    </div>
  );
}

export default RenderAsYouFetch;
