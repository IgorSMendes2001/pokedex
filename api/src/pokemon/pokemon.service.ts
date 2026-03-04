import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private readonly httpService: HttpService) {}

  async findAll(limit: number = 20, offset: number = 0) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}?limit=${limit}&offset=${offset}`)
    );

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const detail = await firstValueFrom(this.httpService.get(pokemon.url));
        return this.formatPokemonData(detail.data);
      })
    );

    return pokemonDetails;
  }

  async findOne(name: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${name.toLowerCase()}`)
      );
      return this.formatPokemonData(data);
    } catch (error) {
      return null;
    }
  }

  private formatPokemonData(data: any) {
    return {
      id: data.id,
      name: data.name,
      image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default,
      types: data.types.map((t: any) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat }))
    };
  }
}