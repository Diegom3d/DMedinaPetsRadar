import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { LostPetsModule } from '../lost-pets/lost-pets.module';

@Module({
    imports: [TypeOrmModule.forFeature([FoundPet]), LostPetsModule],
    controllers: [FoundPetsController],
    providers: [FoundPetsService],
})
export class FoundPetsModule { }
