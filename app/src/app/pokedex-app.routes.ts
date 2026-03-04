import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list.component'; 
import { PokemonDetailComponent } from './pokemon-detail.component';

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:name', component: PokemonDetailComponent },
  { path: '**', redirectTo: '' }
];