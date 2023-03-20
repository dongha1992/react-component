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

if (window) {
  window.useRealAPI = true;
}

interface Resource<T> {
  read: () => T;
}

interface ImageProps {
  src: string;
  alt: string;
  [prop: string]: any;
}

function preloadImage<T>(src: string): Promise<T> {
  return new Promise<T>((resolve) => {
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => resolve(src as T);
  });
}

const imgSrcCache: { [key: string]: Resource<string> } = {};

function Image({ src, alt, ...props }: ImageProps) {
  let imgSrcResource: Resource<string> = imgSrcCache[src];
  if (!imgSrcResource) {
    imgSrcResource = createResource<string>(preloadImage<string>(src));
    imgSrcCache[src] = imgSrcResource;
  }
  return <img src={imgSrcResource.read()} alt={alt} {...props} />;
}

function PokemonInfo({
  pokemonResource,
}: {
  pokemonResource: Resource<any>;
}): JSX.Element {
  const pokemon = pokemonResource.read();
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <Image src={pokemon.image} alt={pokemon.name} />
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

const pokemonResourceCache: { [key: string]: Resource<string> } = {};

function getPokemonResource(name: string): Resource<string> {
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
  const [pokemonResource, setPokemonResource] =
    useState<Resource<string> | null>(null);

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
          "이름을 입력해주세요."
        )}
      </div>
    </div>
  );
}

export default App;
