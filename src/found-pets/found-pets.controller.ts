import { Controller, Post, Body, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
    constructor(private readonly foundPetsService: FoundPetsService) { }

    @Post()
    async create(@Body() createFoundPetDto: CreateFoundPetDto) {
        const result = await this.foundPetsService.create(createFoundPetDto);
        return {
            message: 'Mascota encontrada registrada exitosamente',
            data: result.foundPet,
            matchesFound: result.matchesFound,
            notification:
                result.matchesFound > 0
                    ? `Se notificó a ${result.matchesFound} dueño(s) de mascota(s) perdida(s) cercana(s)`
                    : 'No se encontraron mascotas perdidas en un radio de 500 metros',
        };
    }

    @Get()
    @UseInterceptors(CacheInterceptor)
    @CacheKey('found-pets-list')
    @CacheTTL(60000) // Cache for 60 seconds
    async findAll() {
        const pets = await this.foundPetsService.findAll();
        return {
            message: 'Listado de mascotas encontradas recuperado exitosamente',
            data: pets,
        };
    }
}
