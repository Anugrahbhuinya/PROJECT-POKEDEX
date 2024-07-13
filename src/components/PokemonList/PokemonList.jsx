import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Pokemon from '../Pokemon/Pokemon';
import './PokemonList.css'

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState([true]);
  const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');


  async function downloadPokemons() {
    setIsLoading(true);
    const response = await axios.get(pokedexUrl) // this is the url from which pokemon is downnloaded
    const pokemonResults = response.data.results;//array of the data of 20 pokemons
    console.log(response.data);
    setNextUrl(response.data.next);
    setPrevUrl(response.data.previous);
    //iterating the array and making promises to get that data

    const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
    //passing the url 
    const pokemonData = await axios.all(pokemonResultPromise);
    console.log(pokemonData);
    //extracting the known data
    const res = (pokemonData.map((pokeData) => {
      const pokemon = pokeData.data
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.front_shiny,
        types: pokemon.types
      }
    }))
    //showing the result of the pokemon
    console.log(res)
    setPokemonList(res)
    setIsLoading(false);
  }

  useEffect(() => {
    downloadPokemons()
  }, [pokedexUrl])

  return (
    <>
      <div className='pokemonlist-wrapepr'>

      </div>
      <div className='pokemon_wrapper'>
        {(isLoading) ? 'Loading...' :
          pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />
          )}
      </div>
      <div className='controls'>
        <button disabled={prevUrl==null} onClick={()=>setPokedexUrl(prevUrl)} >Prev</button>
        <button disabled={nextUrl==null} onClick={()=>setPokedexUrl(nextUrl)}>Next</button>
      </div>

    </>
  )
}

export default PokemonList
