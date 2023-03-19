import {
  fetchPokemon,
  getImageUrlForPokemon,
} from "../../../Async/util/pokemon";
import { createResource, preloadImage } from "../../util";

function createPokemonResource(pokemonName: string) {
  const data = createResource(fetchPokemon(pokemonName));
  const image = createResource(
    preloadImage(getImageUrlForPokemon(pokemonName))
  );
  return { data, image };
}

export default createPokemonResource;
