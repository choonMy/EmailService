import { IsString, IsNumber, IsNotEmpty  } from 'class-validator';

export class CreateMockDto {
    @IsString()
    public name?: string;

    @IsNumber()
    @IsNotEmpty()
    public cnt?: number;

}

export class UpdateMockDto {

    @IsNumber()
    public id?: number;

    @IsString()
    public name?: string;

    public cnt?: number
}