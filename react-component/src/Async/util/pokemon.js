import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { preloadImage } from "../../Suspense/util";
// const homepage = process.env.NODE_ENV === "production" ? pkg.homepage : "/";

const BASE_URL = "https://graphql-pokemon2.vercel.app/";
const homepage = "https://react-suspense.netlify.app/";
const fallbackImgUrl = `${homepage}img/pokemon/fallback-pokemon.jpg`;
preloadImage(`${homepage}img/pokeball.png`);
preloadImage(fallbackImgUrl);

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

const formatDate = (date) =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ${String(
    date.getSeconds()
  ).padStart(2, "0")}.${String(date.getMilliseconds()).padStart(3, "0")}`;

// the delay argument is for faking things out a bit
function fetchPokemon(name, delay = 1000) {
  const pokemonQuery = `
    query PokemonInfo($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        image
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `;
  console.log("%c POST ->", "color:green", BASE_URL);

  return window
    .fetch(BASE_URL, {
      // learn more about this API here: https://wayfair.github.io/dociql/
      // test pokemon queries here: https://graphql-pokemon2.vercel.app/
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        delay,
      },
      body: JSON.stringify({
        query: pokemonQuery,
        variables: { name: name.toLowerCase() },
      }),
    })
    .then(async (response) => {
      const { data } = await response.json();
      if (response.ok) {
        const pokemon = data?.pokemon;
        if (pokemon) {
          pokemon.fetchedAt = formatDate(new Date());
          return pokemon;
        } else {
          return Promise.reject(
            new Error(`No pokemon with the name "${name}"`)
          );
        }
      } else {
        // handle the graphql errors
        const error = {
          message: data?.errors?.map((e) => e.message).join("\n"),
        };
        return Promise.reject(error);
      }
    });
}

function getImageUrlForPokemon(name) {
  return `${homepage}img/pokemon/${name.toLowerCase()}.jpg`;
}

function PokemonInfoFallback({ name }) {
  const initialName = React.useRef(name).current;
  const fallbackPokemonData = {
    name: initialName,
    number: "XXX",
    image: "/img/pokemon/fallback-pokemon.jpg",
    attacks: {
      special: [
        { name: "Loading Attack 1", type: "Type", damage: "XX" },
        { name: "Loading Attack 2", type: "Type", damage: "XX" },
      ],
    },
    fetchedAt: "loading...",
  };
  return <PokemonDataView pokemon={fallbackPokemonData} />;
}

function PokemonDataView({ pokemon }) {
  return (
    <>
      <section>
        <h2>
          {pokemon.name}
          <sup>{pokemon.number}</sup>
        </h2>
      </section>
      <section>
        <ul>
          {pokemon.attacks.special.map((attack) => (
            <li key={attack.name}>
              <label>{attack.name}</label>:{" "}
              <span>
                {attack.damage} <small>({attack.type})</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <small className="pokemon-info__fetch-time">{pokemon.fetchedAt}</small>
    </>
  );
}

function PokemonForm({
  pokemonName: externalPokemonName,
  initialPokemonName = externalPokemonName || "",
  onSubmit,
}) {
  const [pokemonName, setPokemonName] = React.useState(initialPokemonName);

  // this is generally not a great idea. We're synchronizing state when it is
  // normally better to derive it https://kentcdodds.com/blog/dont-sync-state-derive-it
  // however, we're doing things this way to make it easier for the exercises
  // to not have to worry about the logic for this PokemonForm component.
  React.useEffect(() => {
    // note that because it's a string value, if the externalPokemonName
    // is the same as the one we're managing, this will not trigger a re-render
    if (typeof externalPokemonName === "string") {
      setPokemonName(externalPokemonName);
    }
  }, [externalPokemonName]);

  function handleChange(e) {
    setPokemonName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(pokemonName);
  }

  function handleSelect(newPokemonName) {
    setPokemonName(newPokemonName);
    onSubmit(newPokemonName);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pokemon-form"
      style={{ marginTop: "40px" }}
    >
      <label htmlFor="pokemonName-input" style={{ marginRight: "20px" }}>
        이름을 눌러보세요.
      </label>
      <small>
        <button
          className="invisible-button"
          type="button"
          onClick={() => handleSelect("pikachu")}
        >
          피카츄
        </button>
        <button
          className="invisible-button"
          type="button"
          onClick={() => handleSelect("charizard")}
        >
          리자드
        </button>
        <button
          className="invisible-button"
          type="button"
          onClick={() => handleSelect("mew")}
        >
          뮤
        </button>
      </small>
      <div style={{ margin: "30px" }}>
        <input
          className="pokemonName-input"
          id="pokemonName-input"
          name="pokemonName"
          placeholder="이름 입력"
          value={pokemonName}
          onChange={handleChange}
        />
        <button type="submit" disabled={!pokemonName.length}>
          제출
        </button>
      </div>
    </form>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      There was an error:{" "}
      <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function PokemonErrorBoundary(props) {
  return <ErrorBoundary FallbackComponent={ErrorFallback} {...props} />;
}

function asyncReducer(state, action) {
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

export {
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  fetchPokemon,
  PokemonErrorBoundary,
  getImageUrlForPokemon,
  asyncReducer,
};
