import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { routes } from './pokedex-app.routes';
import { PokedexAppComponent } from './pokedex-app.component';
import { PokemonService } from './pokemon/pokemon.service';
import { PokemonDetailComponent } from './pokemon-detail.component';
import { PokemonListComponent } from './pokemon-list.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  providers: [PokemonService],
  declarations: [
    PokedexAppComponent,
    PokemonDetailComponent,
    PokemonListComponent,
  ],
  bootstrap: [PokedexAppComponent],
})
export class PokedexAppModule {}
