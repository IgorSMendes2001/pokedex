import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './../../pokemon/pokemon.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpService: HttpService;

  const mockPokemonList = {
    data: {
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    },
  };

  const mockPokemonDetail = {
    data: {
      id: 1,
      name: 'bulbasaur',
      sprites: {
        other: { 'official-artwork': { front_default: 'artwork_url' } },
      },
      types: [{ type: { name: 'grass' } }],
      height: 7,
      weight: 69,
      abilities: [{ ability: { name: 'overgrow' } }],
      stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of formatted pokemon objects', async () => {
      jest.spyOn(httpService, 'get')
        .mockReturnValueOnce(of(mockPokemonList as AxiosResponse))
        .mockReturnValueOnce(of(mockPokemonDetail as AxiosResponse));

      const result = await service.findAll(1, 0);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[0].image).toBe('artwork_url');
    });

    it('should call the external API with correct pagination parameters', async () => {
      const getSpy = jest.spyOn(httpService, 'get')
        .mockReturnValueOnce(of(mockPokemonList as AxiosResponse))
        .mockReturnValueOnce(of(mockPokemonDetail as AxiosResponse));
      
      await service.findAll(10, 20);
      
      expect(getSpy).toHaveBeenNthCalledWith(1, expect.stringContaining('limit=10&offset=20'));
    });
  });

  describe('findOne', () => {
    it('should return detailed pokemon data when a valid name is provided', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockPokemonDetail as AxiosResponse));

      const result = await service.findOne('bulbasaur');

      expect(result?.name).toBe('bulbasaur');
      expect(result?.id).toBe(1);
    });

    it('should return null when the pokemon is not found', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(
        throwError(() => ({ response: { status: 404 } }))
      );

      const result = await service.findOne('non-existent');

      expect(result).toBeNull();
    });
  });
});