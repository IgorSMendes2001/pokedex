import { of, throwError } from 'rxjs';
import { PokemonService, Pokemon } from './pokemon.service';

const mockHttpClient: any = {
  get: jest.fn(),
};

describe('PokemonService', () => {
  let service: PokemonService;

  const mockPokemon: Pokemon = {
    id: 25,
    name: 'pikachu',
    image: 'https://example.com/pikachu.png',
    types: ['electric'],
    height: 4,
    weight: 60,
    abilities: ['static', 'lightning-rod'],
    stats: [
      { name: 'hp', value: 35 },
      { name: 'attack', value: 55 },
    ],
  };

  const mockPokemonList: Pokemon[] = [
    mockPokemon,
    {
      id: 1,
      name: 'bulbasaur',
      image: 'https://example.com/bulbasaur.png',
      types: ['grass', 'poison'],
      height: 7,
      weight: 69,
      abilities: ['overgrow', 'chlorophyll'],
      stats: [
        { name: 'hp', value: 45 },
        { name: 'attack', value: 49 },
      ],
    },
  ];

  beforeEach(() => {
    service = new PokemonService(mockHttpClient);
    jest.clearAllMocks();
  });

  afterEach(() => {
    service.clearCache();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemons', () => {
    it('should fetch pokemons from API on first call', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemonList));

      service.getPokemons(20, 0).subscribe((pokemons) => {
        expect(pokemons).toEqual(mockPokemonList);
        expect(pokemons.length).toBe(2);
        expect(mockHttpClient.get).toHaveBeenCalledWith(
          'http://localhost:3000/api/pokemon?limit=20&offset=0',
        );
        done();
      });
    });

    it('should cache pokemons list and reuse on subsequent calls', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemonList));

      // First call
      service.getPokemons(20, 0).subscribe(() => {
        // Second call should use cache
        service.getPokemons(20, 0).subscribe((pokemons) => {
          expect(pokemons).toEqual(mockPokemonList);
          expect(mockHttpClient.get).toHaveBeenCalledTimes(1); // Only one HTTP call
          done();
        });
      });
    });

    it('should cache individual pokemons from list', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemonList));

      service.getPokemons(20, 0).subscribe(() => {
        // After fetching list, individual pokemons should be cached
        service.getPokemonByName('pikachu').subscribe((pokemon) => {
          expect(pokemon).toEqual(mockPokemon);
          expect(mockHttpClient.get).toHaveBeenCalledTimes(1); // No additional HTTP request
          done();
        });
      });
    });

    it('should handle different limit and offset parameters', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemonList));

      service.getPokemons(10, 20).subscribe((pokemons) => {
        expect(pokemons).toEqual(mockPokemonList);
        expect(mockHttpClient.get).toHaveBeenCalledWith(
          'http://localhost:3000/api/pokemon?limit=10&offset=20',
        );
        done();
      });
    });
  });

  describe('getPokemonByName', () => {
    it('should fetch pokemon from API by name', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemon));

      service.getPokemonByName('pikachu').subscribe((pokemon) => {
        expect(pokemon).toEqual(mockPokemon);
        expect(pokemon.name).toBe('pikachu');
        expect(mockHttpClient.get).toHaveBeenCalledWith(
          'http://localhost:3000/api/pokemon/pikachu',
        );
        done();
      });
    });

    it('should cache fetched pokemon on subsequent calls', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemon));

      // First call
      service.getPokemonByName('pikachu').subscribe(() => {
        // Second call should use cache
        service.getPokemonByName('pikachu').subscribe((pokemon) => {
          expect(pokemon).toEqual(mockPokemon);
          expect(mockHttpClient.get).toHaveBeenCalledTimes(1); // Only one HTTP call
          done();
        });
      });
    });

    it('should normalize pokemon name to lowercase', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemon));

      service.getPokemonByName('PIKACHU').subscribe((pokemon) => {
        expect(pokemon).toEqual(mockPokemon);
        expect(mockHttpClient.get).toHaveBeenCalledWith(
          'http://localhost:3000/api/pokemon/pikachu',
        );
        done();
      });
    });

    it('should cache pokemon by both name and id', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemon));

      service.getPokemonByName('pikachu').subscribe(() => {
        // Should be cached by both name and id
        service.getPokemonByName('25').subscribe((pokemon) => {
          expect(pokemon).toEqual(mockPokemon);
          expect(mockHttpClient.get).toHaveBeenCalledTimes(1); // No additional HTTP call
          done();
        });
      });
    });

    it('should handle errors when pokemon is not found', (done) => {
      const error = { status: 404, statusText: 'Not Found' };
      mockHttpClient.get.mockReturnValue(throwError(() => error));

      service.getPokemonByName('nonexistent').subscribe({
        next: () => fail('should have failed'),
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        },
      });
    });
  });

  describe('clearCache', () => {
    it('should clear cache and fetch from API again', (done) => {
      mockHttpClient.get.mockReturnValue(of(mockPokemonList));

      // Load some data
      service.getPokemons(20, 0).subscribe(() => {
        // Clear cache
        service.clearCache();

        // Next calls should fetch from API again
        service.getPokemons(20, 0).subscribe(() => {
          expect(mockHttpClient.get).toHaveBeenCalledTimes(2); // Two HTTP calls
          done();
        });
      });
    });
  });
});
