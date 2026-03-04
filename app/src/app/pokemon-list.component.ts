import { Component, OnInit } from '@angular/core';
import { PokemonService, Pokemon } from './pokemon/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokedex-app.component.scss',
  standalone: false
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  loading: boolean = false;
  limit: number = 20;
  offset: number = 0;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit() {
    this.loadMore();
  }

  loadMore() {
    if (this.loading) return;
    this.loading = true;
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: (data) => {
        this.pokemons = [...this.pokemons, ...data];
        this.offset += this.limit;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  goToDetail(name: string) {
    this.router.navigate(['/pokemon', name]);
  }
}