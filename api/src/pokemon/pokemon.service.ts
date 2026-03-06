import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

interface CacheEntry {
  data: any;
  timestamp: number;
}

@Injectable()
export class PokemonService {
  private readonly baseUrl = "https://pokeapi.co/api/v2/pokemon";
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 1000 * 60 * 60;

  constructor(private readonly httpService: HttpService) {}

  async findAll(limit: number = 20, offset: number = 0) {
    const cacheKey = `list-${limit}-${offset}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[Cache HIT] List ${limit}-${offset}`);
      return cached.data;
    }

    console.log(`[Cache MISS] Fetching list ${limit}-${offset}`);
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}?limit=${limit}&offset=${offset}`),
    );

    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: any) => {
        const id = pokemon.url.split("/").filter(Boolean).pop();
        const cachedPokemon = this.cache.get(id);

        if (
          cachedPokemon &&
          Date.now() - cachedPokemon.timestamp < this.CACHE_TTL
        ) {
          return cachedPokemon.data;
        }

        const detail = await firstValueFrom(this.httpService.get(pokemon.url));
        const formattedData = this.formatPokemonData(detail.data);

        this.cache.set(id, { data: formattedData, timestamp: Date.now() });
        this.cache.set(detail.data.name.toLowerCase(), {
          data: formattedData,
          timestamp: Date.now(),
        });

        return formattedData;
      }),
    );

    this.cache.set(cacheKey, { data: pokemonDetails, timestamp: Date.now() });
    return pokemonDetails;
  }

  async findOne(nameOrId: string) {
    const cacheKey = nameOrId.toLowerCase();

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`[Cache HIT] ${cacheKey}`);
      return cached.data;
    }

    try {
      console.log(`[Cache MISS] Fetching ${cacheKey} from PokeAPI`);
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${cacheKey}`),
      );
      const formattedData = this.formatPokemonData(data);

      this.cache.set(cacheKey, { data: formattedData, timestamp: Date.now() });
      this.cache.set(String(data.id), {
        data: formattedData,
        timestamp: Date.now(),
      });
      this.cache.set(data.name.toLowerCase(), {
        data: formattedData,
        timestamp: Date.now(),
      });

      return formattedData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[Error] Failed to fetch ${cacheKey}:`, errorMessage);
      return null;
    }
  }

  private formatPokemonData(data: any) {
    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites?.other?.["official-artwork"]?.front_default ||
        data.sprites?.front_default,
      types: data.types.map((t: any) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  }

  clearCache() {
    this.cache.clear();
    console.log("[Cache] Cache cleared");
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
