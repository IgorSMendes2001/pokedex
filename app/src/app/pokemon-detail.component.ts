import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from './pokemon/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokedex-app.component.scss',
  standalone: false,
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  pokemon: any;
  loading: boolean = true;
  error: boolean = false;
  private routeSubscription?: Subscription;
  private pokemonSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    console.log('[PokemonDetail] ngOnInit called');

    // Inscreve-se nas mudanças de parâmetros da rota
    // Isso permite que o componente reaja quando o parâmetro muda
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const nameOrId = params.get('name');
      console.log('[PokemonDetail] Route param changed:', nameOrId);

      if (nameOrId) {
        this.loadPokemon(nameOrId);
      }
    });
  }

  ngOnDestroy() {
    console.log('[PokemonDetail] ngOnDestroy called');
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe();
    }
  }

  loadPokemon(nameOrId: string) {
    console.log('[PokemonDetail] Loading pokemon:', nameOrId);

    // Cancela requisição anterior se existir
    if (this.pokemonSubscription) {
      console.log('[PokemonDetail] Cancelling previous request');
      this.pokemonSubscription.unsubscribe();
    }

    this.loading = true;
    this.error = false;
    this.pokemon = null;
    this.cdr.detectChanges();

    this.pokemonSubscription = this.pokemonService
      .getPokemonByName(nameOrId)
      .subscribe({
        next: (data) => {
          console.log('[PokemonDetail] Pokemon loaded:', data);
          this.pokemon = data;
          this.loading = false;
          console.log(
            '[PokemonDetail] Setting loading to false, triggering change detection',
          );
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[PokemonDetail] Error loading pokemon:', err);
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
        },
      });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  trackByType(index: number, type: string): string {
    return type;
  }

  trackByStatName(index: number, stat: any): string {
    return stat.name;
  }
}
