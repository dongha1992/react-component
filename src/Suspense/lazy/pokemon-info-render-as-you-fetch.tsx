import { PokemonDataView } from "../../Async/util/pokemon";

function PokemonInfo({ pokemonResource }: any) {
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
