import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Delete,
} from "@nestjs/common";
import { PokemonService } from "./pokemon.service";

@Controller("pokemon")
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async getPokemons(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
  ) {
    return this.pokemonService.findAll(
      Number(limit) || 20,
      Number(offset) || 0,
    );
  }

  @Get("cache/stats")
  getCacheStats() {
    return this.pokemonService.getCacheStats();
  }

  @Delete("cache")
  clearCache() {
    this.pokemonService.clearCache();
    return { message: "Cache cleared successfully" };
  }

  @Get(":nameOrId")
  async getPokemon(@Param("nameOrId") nameOrId: string) {
    const pokemon = await this.pokemonService.findOne(nameOrId);
    if (!pokemon) {
      throw new NotFoundException("Pokémon não encontrado");
    }
    return pokemon;
  }
}
