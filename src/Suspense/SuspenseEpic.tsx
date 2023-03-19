import { Suspense } from "react";
import {
  fetchPokemon,
  PokemonDataView,
  PokemonErrorBoundary as ErrorBoundary,
  PokemonInfoFallback,
} from "../Async/util/pokemon";
import "../Cache/index.css";

const createResource = (promise: any) => {
  let status = "pending";

  let result = promise.then(
    (resolved: any) => {
      status = "resolved";
      result = resolved;
    },
    (rejected: any) => {
      status = "rejected";
      result = rejected;
    }
  );

  return {
    read() {
      if (status === "pending") throw result;
      if (status === "rejected") throw result;
      if (status === "resolved") return result;
    },
  };
};

const fetechedResource = createResource(fetchPokemon("pikachu"));

function PokemonInfo() {
  const pokemon = fetechedResource.read();
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon?.image!} alt={pokemon?.name!} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  );
}

function SuspenseEpic() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <ErrorBoundary>
          <Suspense fallback={<PokemonInfoFallback name={"pikachu"} />}>
            <PokemonInfo />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default SuspenseEpic;
