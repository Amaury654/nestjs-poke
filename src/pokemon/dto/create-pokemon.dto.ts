import { IsInt, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsInt()
    @Min(1)
    @IsPositive()
    no: number;

    @IsString({ message: `The brand must be a string` })
    @MinLength(2)
    @MaxLength(20)
    name: string;

}
