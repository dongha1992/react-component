import {
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
import { useAsync } from "../hooks/useAsync";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

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
