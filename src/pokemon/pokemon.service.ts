import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { Pokemon } from './entities/pokemon.entity'
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()


export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }



  async findAll() {

    try {
      const porkemons = await this.pokemonModel.find();
      if (porkemons.length < 1) {
        return 'Empty[]'
      } else {
        return {
          status: "success",
          results: porkemons.length,
          porkemons,
        }
      }

    } catch (error) {
      console.log(error)
    }

  }



  async findOne(term: string) {
    let pokenFound: Pokemon;

    if (!isNaN(+term)) {
      pokenFound = await this.pokemonModel.findOne({ no: term });
      if(!pokenFound){
        throw new NotFoundException(`Pokemon not Found with No:${term}`);
      }
      return pokenFound
    }

    if (!pokenFound && isValidObjectId(term)) {
      pokenFound = await this.pokemonModel.findById(term);
    }

    if (!pokenFound) {
      pokenFound = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if (!pokenFound) throw new NotFoundException(`Pokemon not Found with id or name ${term}`);

    return pokenFound;

  }





  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term)
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }





  async remove(id: string) {

      const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});

        if(deletedCount === 0){
          throw new BadRequestException(`Pokemon with id "${id}" not found`)
        }

      return deletedCount;

  }



  private handleExceptions(error: any){
    if (error.code === 11000) {
      console.log(error)
      throw new BadRequestException(`This PokeUser alreadt exist in DB ${JSON.stringify(error.keyValue)} `)
    } else {
      throw new InternalServerErrorException(`Server Down ${error}`)
    }
  }

}
