import { Controller, Post, Body } from '@nestjs/common';
import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Controller('lost-pets')
export class LostPetsController {
    constructor(private readonly lostPetsService: LostPetsService) { }

    @Post()
    async create(@Body() createLostPetDto: CreateLostPetDto) {
        const lostPet = await this.lostPetsService.create(createLostPetDto);
        return {
            message: 'Mascota perdida registrada exitosamente',
            data: lostPet,
        };
    }
}
