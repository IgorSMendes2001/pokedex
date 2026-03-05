import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from './pokemon/pokemon.service';

@Component({
  selector: 'pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokedex-app.component.scss',
  standalone: false,
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.loading = true;
      this.error = false;
      this.pokemonService.getPokemonByName(name).subscribe({
        next: (data) => {
          this.pokemon = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
    }
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
