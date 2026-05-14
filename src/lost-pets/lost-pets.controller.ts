import { Controller, Post, Body, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
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

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('lost-pets-list')
    @CacheTTL(60000) // Cache for 60 seconds
    async findAll() {
        const pets = await this.lostPetsService.findAll();
        return {
            message: 'Listado de mascotas perdidas activas recuperado exitosamente',
            data: pets,
        };
    }
}
