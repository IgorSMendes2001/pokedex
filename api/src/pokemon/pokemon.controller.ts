import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async getPokemons(
    @Query('limit') limit?: string, 
    @Query('offset') offset?: string
  ) {
    return this.pokemonService.findAll(Number(limit) || 20, Number(offset) || 0);
  }

  @Get(':name')
  async getPokemon(@Param('name') name: string) {
    const pokemon = await this.pokemonService.findOne(name);
    if (!pokemon) {
      throw new NotFoundException('Pokémon não encontrado');
    }
    return pokemon;
  }
}