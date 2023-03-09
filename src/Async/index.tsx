import React, {
  Reducer,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
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

function useSafeDispatch(dispatch: any) {
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(
    (action: any) => {
      if (mountedRef.current) {
        dispatch({ ...action });
      }
    },
    [dispatch]
  );
}

function useAsync<T>(initialState: Partial<AsyncState<T>> = {}) {
  const [state, unSafeDispatch] = useReducer(
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

  const dispatch = useSafeDispatch(unSafeDispatch);

  const run = useCallback((promise) => {
    dispatch({ type: "pending" });
    promise.then(
      (data: any) => {
        dispatch({ type: "resolved", data });
      },
      (error: any) => {
        dispatch({ type: "rejected", error });
      }
    );
  }, []);

  return { ...state, run };

  //  // /**** START : useCallback과 API fetch  ****/

  // useEffect(() => {
  //   const promise = asyncCallback();
  //   if (!promise) {
  //     return;
  //   }
  //   dispatch({ type: "pending" });
  //   promise.then(
  //     (data) => {
  //       dispatch({ type: "resolved", data });
  //     },
  //     (error) => {
  //       dispatch({ type: "rejected", error });
  //     }
  //   );
  //   // 1. asyncCallback이 디펜더시에 추가되어야 하는데 그렇게 되면 무한루프에 빠진다.
  // }, [asyncCallback]);

  // /**** END : useCallback과 API fetch  ****/

  // return state
}

function PokemonInfo({ pokemonName }: { pokemonName: string }) {
  // /**** START : useCallback과 API fetch  ****/

  // const asyncCallback = useCallback((): any => {
  //   //2. asyncCallback이 pokemonName가 바뀌었을 때만 동작하도록 만들어줘야 한다.
  //   if (!pokemonName) {
  //     return null;
  //   }
  //   return fetchPokemon(pokemonName);
  // }, [pokemonName]);

  // const state = useAsync(
  //   /* 아래 함수를 위의 asyncCallback 로 변경*/

  //   // (): any => {
  //   //   if (!pokemonName) {
  //   //     return null;
  //   //   }
  //   //   return fetchPokemon(pokemonName);
  //   // },
  //   asyncCallback,
  //   { status: pokemonName ? "pending" : "idle" }
  // );

  // /* 3. 근데 api fetch useCallback 쓰는 건 좋지 않은 일(?) */

  // /**** END : useCallback과 API fetch  ****/

  /**** START : run function으로 대체  ****/

  const {
    data: pokemon,
    status,
    error,
    run,
  } = useAsync({
    status: pokemonName ? "pending" : "idle",
  });

  useEffect(() => {
    if (!pokemonName) return;
    return run(fetchPokemon(pokemonName));
  }, [pokemonName, run]);

  /**** END : run function으로 대체  ****/

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
