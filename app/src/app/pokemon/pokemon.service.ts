import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'http://localhost:3000/pokemon';

  constructor(private http: HttpClient) {}

  getPokemons(limit: number, offset: number): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${name}`);
  }
}