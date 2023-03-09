import { Reducer, useEffect, useReducer, useState } from "react";
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
} from "./util/pokemon";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

type AsyncState<T> = {
  status: "idle" | "pending" | "resolved" | "rejected";
  data: T | null;
  error: Error | null;
};

type AsyncCallback<T> = () => Promise<T>;

type AsyncAction<T> =
  | { type: "pending" }
  | { type: "resolved"; data: T }
  | { type: "rejected"; error: Error }
  | { type: undefined };

function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case "pending": {
      return { status: "pending", data: null, error: null };
    }
    case "resolved": {
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useAsync<T>(
  asyncCallback: AsyncCallback<T>,
  initialState: Partial<AsyncState<T>> = {},
  dependencies: React.DependencyList = []
): AsyncState<T> {
  const [state, dispatch] = useReducer(
    asyncReducer as Reducer<
      AsyncState<T>,
      { type: string; data?: T; error?: Error }
    >,
    {
      status: "idle",
      data: null,
      error: null,
      ...initialState,
    }
  );

  useEffect(() => {
    const promise = asyncCallback();
    if (!promise) {
      return;
    }
    dispatch({ type: "pending" });
    promise.then(
      (data) => {
        dispatch({ type: "resolved", data });
      },
      (error) => {
        dispatch({ type: "rejected", error });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return state;
}

function PokemonInfo({ pokemonName }: { pokemonName: string }) {
  const state = useAsync(
    (): any => {
      if (!pokemonName) {
        return null;
      }
      return fetchPokemon(pokemonName);
    },
    { status: pokemonName ? "pending" : "idle" },
    [pokemonName]
  );

  const { data: pokemon, status, error } = state;

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
