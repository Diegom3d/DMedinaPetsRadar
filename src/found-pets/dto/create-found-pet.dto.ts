import {
    IsString,
    IsEmail,
    IsOptional,
    IsNumber,
    IsDateString,
    IsIn,
} from 'class-validator';

export class CreateFoundPetDto {
    @IsString()
    species: string;

    @IsOptional()
    @IsString()
    breed?: string;

    @IsString()
    color: string;

    @IsString()
    @IsIn(['pequeño', 'mediano', 'grande'])
    size: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    photo_url?: string;

    @IsString()
    finder_name: string;

    @IsEmail()
    finder_email: string;

    @IsString()
    finder_phone: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsString()
    address: string;

    @IsDateString()
    found_date: string;
}
