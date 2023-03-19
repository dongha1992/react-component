import React, { useTransition } from "react";
import {
  PokemonInfoFallback,
  PokemonForm,
  PokemonErrorBoundary,
} from "../../Async/util/pokemon";
import createPokemonInfoResource from "../lazy/pokemon-info-render-as-you-fetch";

const PokemonInfo = React.lazy(
  () => import("../lazy/pokemon-info-render-as-you-fetch")
);

const SUSPENSE_CONFIG: any = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
};

const pokemonResourceCache: any = {};

function getPokemonResource(name: string) {
  const lowerName = name.toLowerCase();
  let resource = pokemonResourceCache[lowerName];
  if (!resource) {
    resource = createPokemonInfoResource(lowerName);
    pokemonResourceCache[lowerName] = resource;
  }
  return resource;
}

function App() {
  //   const [pokemonName, setPokemonName] = React.useState("");
  //   const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  //   const [pokemonResource, setPokemonResource] = React.useState(null);
  //   React.useEffect(() => {
  //     if (!pokemonName) {
  //       setPokemonResource(null);
  //       return;
  //     }
  //     startTransition((): any => {
  //       setPokemonResource(getPokemonResource(pokemonName));
  //     });
  //   }, [pokemonName, startTransition]);
  //   function handleSubmit(newPokemonName: string) {
  //     setPokemonName(newPokemonName);
  //   }
  //   function handleReset() {
  //     setPokemonName("");
  //   }
  //   return (
  //     <div>
  //       <h1 style={{ textAlign: "center" }}>
  //         {"Render as you fetch "}
  //         <span role="img" aria-label="thumbs up">
  //           👍
  //         </span>
  //       </h1>
  //       <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
  //       <hr />
  //       <div className={`pokemon-info ${isPending ? "pokemon-loading" : ""}`}>
  //         {pokemonResource ? (
  //           <PokemonErrorBoundary
  //             onReset={handleReset}
  //             resetKeys={[pokemonResource]}
  //           >
  //             <React.Suspense
  //               fallback={<PokemonInfoFallback name={pokemonName} />}
  //             >
  //               <PokemonInfo pokemonResource={pokemonResource} />
  //             </React.Suspense>
  //           </PokemonErrorBoundary>
  //         ) : (
  //           "Submit a pokemon"
  //         )}
  //       </div>
  //     </div>
  //   );
}

export default App;
