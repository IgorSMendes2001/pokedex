import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './../../pokemon/pokemon.controller';
import { PokemonService } from './../../pokemon/pokemon.service';
import { NotFoundException } from '@nestjs/common';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  const mockFormattedPokemon = { id: 1, name: 'bulbasaur', image: 'url', types: ['grass'] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockFormattedPokemon]),
            findOne: jest.fn().mockResolvedValue(mockFormattedPokemon),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

 describe('getPokemons', () => {
    it('should return an array of pokemons', async () => {
      const result = await controller.getPokemons('10', '0');
      expect(result).toEqual([mockFormattedPokemon]);
      expect(service.findAll).toHaveBeenCalledWith(10, 0);
    });

    it('should use default pagination values when queries are undefined', async () => {
      // Em vez de "", passamos undefined para simular a ausência do parâmetro na URL
      await controller.getPokemons(undefined, undefined);
      
      // O Number(undefined) é NaN, e (NaN || 20) resulta em 20.
      expect(service.findAll).toHaveBeenCalledWith(20, 0);
    });
    
    it('should handle string values and convert them to numbers', async () => {
      await controller.getPokemons('5', '15');
      expect(service.findAll).toHaveBeenCalledWith(5, 15);
    });
  });

  describe('getPokemon', () => {
    it('should return a single pokemon by name', async () => {
      const result = await controller.getPokemon('bulbasaur');
      expect(result).toEqual(mockFormattedPokemon);
      expect(service.findOne).toHaveBeenCalledWith('bulbasaur');
    });

    it('should throw a NotFoundException when service returns null', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.getPokemon('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});