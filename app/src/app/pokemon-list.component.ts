import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokemonService, Pokemon } from './pokemon/pokemon.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokedex-app.component.scss',
  standalone: false,
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  loading: boolean = false;
  error: boolean = false;
  hasMore: boolean = true;
  limit: number = 20;
  offset: number = 0;
  private routerSubscription?: Subscription;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.resetState();
    this.loadMore();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/' || event.url === '') {
          if (this.pokemons.length > 0) {
            this.resetState();
            this.loadMore();
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  resetState() {
    this.pokemons = [];
    this.offset = 0;
    this.hasMore = true;
    this.loading = false;
    this.error = false;
  }

  loadMore() {
    if (this.loading || !this.hasMore) {
      console.log('Load more blocked:', {
        loading: this.loading,
        hasMore: this.hasMore,
      });
      return;
    }

    console.log(`Loading more: offset=${this.offset}, limit=${this.limit}`);
    this.loading = true;
    this.error = false;

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: (data) => {
        console.log('Received data:', data?.length || 0, 'pokemons');
        if (data && data.length > 0) {
          this.pokemons = [...this.pokemons, ...data];
          this.offset += this.limit;
          this.hasMore = data.length === this.limit;
          console.log('Updated state:', {
            totalPokemons: this.pokemons.length,
            offset: this.offset,
            hasMore: this.hasMore,
          });
        } else {
          this.hasMore = false;
          console.log('No more pokemons available');
        }
        this.loading = false;
        this.error = false;
      },
      error: (err) => {
        console.error('Failed to load pokemons:', err);
        this.loading = false;
        this.error = true;
      },
    });
  }

  retry() {
    this.error = false;
    this.hasMore = true;
    this.loadMore();
  }

  goToDetail(name: string) {
    this.router.navigate(['/pokemon', name]);
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  trackByType(index: number, type: string): string {
    return type;
  }
}
