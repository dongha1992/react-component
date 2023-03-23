import { PokemonDataView } from "../../Async/util/pokemon";
import { Data, Resource } from "../SuspenseImage";

function PokemonInfo({
  pokemonResource,
}: {
  pokemonResource: Resource<Data>;
}): JSX.Element {
  const pokemon = pokemonResource.data.read();
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemonResource.image.read()} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  );
}
export default PokemonInfo;
