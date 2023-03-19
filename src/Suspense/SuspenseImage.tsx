import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
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
  [key: string]: any;
}

interface Resource {
  read: () => PokemonData;
}

// ❗❗❗❗
// 🦉 On this one, make sure that you UNCHECK the "Disable cache" checkbox
// in your DevTools "Network Tab". We're relying on that cache for this
// approach to work!
// ❗❗❗❗

// we need to make a place to store the resources outside of render so
// 🐨 create "cache" object here.

// 🐨 create an Img component that renders a regular <img /> and accepts a src
// prop and forwards on any remaining props.
// 🐨 The first thing you do in this component is check whether your
// imgSrcResourceCache already has a resource for the given src prop. If it does
// not, then you need to create one (💰 using createResource).
// 🐨 Once you have the resource, then render the <img />.
// 💰 Here's what rendering the <img /> should look like:
// <img src={imgSrcResource.read()} {...props} />

function PokemonInfo({ pokemonResource }: any): any {
  const pokemon = pokemonResource.read();
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        {/* 🐨 swap this img for your new Img component */}
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  );
}

// const SUSPENSE_CONFIG = {
//   timeoutMs: 4000,
//   busyDelayMs: 300,
//   busyMinDurationMs: 700,
// };

const pokemonResourceCache: { [key: string]: Resource } = {};

function getPokemonResource(name: string): Resource {
  const lowerName = name.toLowerCase();
  let resource = pokemonResourceCache[lowerName];
  if (!resource) {
    resource = createPokemonResource(lowerName);
    pokemonResourceCache[lowerName] = resource;
  }
  return resource;
}

function createPokemonResource(pokemonName: string) {
  return createResource(fetchPokemon(pokemonName));
}

function App() {
  const [isPending, startTransition] = useTransition();
  const [pokemonName, setPokemonName] = useState<string>("");
  const [pokemonResource, setPokemonResource] = useState<Resource | null>(null);

  useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null);
      return;
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName));
    });
  }, [pokemonName, startTransition]);

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
      <div className={`pokemon-info ${isPending ? "pokemon-loading" : ""}`}>
        {pokemonResource ? (
          <ErrorBoundary onReset={handleReset} resetKeys={[pokemonResource]}>
            <Suspense fallback={<PokemonInfoFallback name={pokemonName} />}>
              <PokemonInfo pokemonResource={pokemonResource} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          "Submit a pokemon"
        )}
      </div>
    </div>
  );
}

export default App;
