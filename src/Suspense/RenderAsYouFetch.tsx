import * as React from "react";
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from "../Async/util/pokemon";
import { createResource } from "./util";

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

function RenderAsYouFetch() {
  const [pokemonName, setPokemonName] = React.useState<string>("");
  const [pokemonResource, setPokemonResource] = React.useState<{
    read: () => PokemonData;
  } | null>(null);

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null);
      return;
    }
    setPokemonResource(createResource(fetchPokemon(pokemonName)));
  }, [pokemonName]);

  function handleSubmit(newPokemonName: any) {
    setPokemonName(newPokemonName);
  }

  function handleReset() {
    setPokemonName("");
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <React.Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
        <div className="pokemon-info">
          {pokemonResource ? (
            <PokemonErrorBoundary
              onReset={handleReset}
              resetKeys={[pokemonResource]}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </PokemonErrorBoundary>
          ) : (
            <span>"Submit a pokemon"</span>
          )}
        </div>
      </React.Suspense>
    </div>
  );
}

export default RenderAsYouFetch;
