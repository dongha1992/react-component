import React, { Suspense, useEffect, useState, useTransition } from "react";
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonErrorBoundary as ErrorBoundary,
  getImageUrlForPokemon,
} from "../Async/util/pokemon";
import { createResource } from "./util";
import "./index.css";

window.useRealAPI = true;

const PokemonInfo = React.lazy(
  () => import("./lazy/pokemon-info-render-as-you-fetch")
);

export type Data = any;

export interface Resource<T> {
  data: { read: () => T };
  image: {
    read: () => T;
  };
}

function preloadImage<T>(src: string): Promise<T> {
  return new Promise<T>((resolve) => {
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => resolve(src as T);
  });
}

const pokemonResourceCache: { [key: string]: Resource<Data> } = {};

function getPokemonResource(name: string): Resource<Data> {
  const lowerName = name.toLowerCase();
  let resource = pokemonResourceCache[lowerName];
  if (!resource) {
    resource = createPokemonResource(lowerName);
    pokemonResourceCache[lowerName] = resource;
  }
  return resource;
}

function createPokemonResource(pokemonName: string) {
  const data = createResource(fetchPokemon(pokemonName));
  const image = createResource(
    preloadImage(getImageUrlForPokemon(pokemonName))
  );
  return { data, image };
}

function WithSuspenseHook() {
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

export default WithSuspenseHook;
