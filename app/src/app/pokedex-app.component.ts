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
    const term = this.searchTerm.trim();
    if (term) {
      console.log('[PokedexApp] Searching for:', term);
      this.router.navigate(['/pokemon', term.toLowerCase()]);
      this.searchTerm = '';
    }
  }

  resetList() {
    this.router.navigate(['/']);
  }
}
