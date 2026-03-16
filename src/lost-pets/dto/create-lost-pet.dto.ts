import {
    IsString,
    IsEmail,
    IsOptional,
    IsNumber,
    IsDateString,
    IsIn,
} from 'class-validator';

export class CreateLostPetDto {
    @IsString()
    name: string;

    @IsString()
    species: string;

    @IsString()
    breed: string;

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
    owner_name: string;

    @IsEmail()
    owner_email: string;

    @IsString()
    owner_phone: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsString()
    address: string;

    @IsDateString()
    lost_date: string;
}
