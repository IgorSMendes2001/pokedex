import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height?: number;
  weight?: number;
  abilities?: string[];
  stats?: { name: string; value: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000/api/pokemon';
  private pokemonCache = new Map<string, Pokemon>();
  private listCache = new Map<string, Pokemon[]>();

  constructor(private http: HttpClient) {}

  getPokemons(limit: number, offset: number): Observable<Pokemon[]> {
    const cacheKey = `${limit}-${offset}`;

    // Return from cache if available
    if (this.listCache.has(cacheKey)) {
      console.log(`[Service] Cache hit for ${cacheKey}`);
      return of(this.listCache.get(cacheKey)!);
    }

    // Make HTTP request
    console.log(
      `[Service] Fetching pokemons: limit=${limit}, offset=${offset}`,
    );
    return this.http
      .get<Pokemon[]>(`${this.apiUrl}?limit=${limit}&offset=${offset}`)
      .pipe(
        tap((pokemons) => {
          console.log(`[Service] Received ${pokemons.length} pokemons`);
          // Cache the result
          this.listCache.set(cacheKey, pokemons);
          // Cache individual pokemons
          pokemons.forEach((p) =>
            this.pokemonCache.set(p.name.toLowerCase(), p),
          );
        }),
        catchError((error) => {
          console.error('[Service] Error loading pokemons:', error);
          throw error;
        }),
      );
  }

  getPokemonByName(nameOrId: string): Observable<Pokemon> {
    const normalizedName = nameOrId.toLowerCase();

    console.log(`[Service] Getting pokemon: ${normalizedName}`);

    // Check cache first
    if (this.pokemonCache.has(normalizedName)) {
      console.log(`[Service] Cache HIT for ${normalizedName}`);
      return of(this.pokemonCache.get(normalizedName)!);
    }

    console.log(
      `[Service] Cache MISS for ${normalizedName}, fetching from API`,
    );
    return this.http.get<Pokemon>(`${this.apiUrl}/${normalizedName}`).pipe(
      tap((pokemon) => {
        console.log(`[Service] Received pokemon from API:`, pokemon.name);
        // Cache com múltiplas chaves (nome e ID)
        this.pokemonCache.set(normalizedName, pokemon);
        this.pokemonCache.set(pokemon.name.toLowerCase(), pokemon);
        this.pokemonCache.set(String(pokemon.id), pokemon);
      }),
      catchError((error) => {
        console.error(
          `[Service] Error loading pokemon ${normalizedName}:`,
          error,
        );
        throw error;
      }),
    );
  }

  clearCache(): void {
    this.pokemonCache.clear();
    this.listCache.clear();
  }
}
