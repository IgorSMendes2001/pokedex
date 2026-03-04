import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pokedex',
  templateUrl: './pokedex-app.component.html',
  styleUrl: './pokedex-app.component.scss',
  standalone: false,
})
export class PokedexAppComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/pokemon', this.searchTerm.toLowerCase()]);
      this.searchTerm = '';
    }
  }

  resetList() {
    this.router.navigate(['/']);
  }
}