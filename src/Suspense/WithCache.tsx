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

const ResourceCacheContext = createContext<(name: string) => Resource | null>(
  () => null
);

const useResourceCache = () => {
  const context = useContext(ResourceCacheContext);
  if (!context) {
    throw new Error("useResourceCache must be used within a CacheProvider");
  }
  return context;
};

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

function CacheProvider({ children }: { children: React.ReactElement }) {
  const cacheRef = useRef<{ [key: string]: Resource }>({});

  const getResourceByCache = useCallback((name: string): Resource | null => {
    let resource: Resource | undefined = cacheRef.current[name];
    if (!resource) {
      resource = createResource<PokemonData>(fetchPokemon(name));
      cacheRef.current[name] = resource as Resource;
    }
    return resource;
  }, []);

  return (
    <ResourceCacheContext.Provider value={getResourceByCache}>
      {children}
    </ResourceCacheContext.Provider>
  );
}

function WithCache() {
  const [pokemonName, setPokemonName] = useState<string>("");
  const [pokemonResource, setPokemonResource] = useState<Resource | null>(null);

  const [isPending, startTransition] = useTransition();
  const getResourceByCache = useResourceCache();

  useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null);
      return;
    }
    startTransition(() => {
      setPokemonResource(getResourceByCache(pokemonName));
    });
  }, [pokemonName, startTransition, getResourceByCache]);

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

function WithCacheProvider() {
  return (
    <CacheProvider>
      <WithCache />
    </CacheProvider>
  );
}

export default WithCacheProvider;
