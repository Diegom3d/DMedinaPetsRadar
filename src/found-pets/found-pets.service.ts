import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { LostPetsService } from '../lost-pets/lost-pets.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class FoundPetsService {
    private readonly logger = new Logger(FoundPetsService.name);

    constructor(
        @InjectRepository(FoundPet)
        private readonly foundPetRepository: Repository<FoundPet>,
        private readonly lostPetsService: LostPetsService,
        private readonly mailService: MailService,
    ) { }

    async create(dto: CreateFoundPetDto): Promise<{
        foundPet: FoundPet;
        matchesFound: number;
    }> {
        // 1. Insert the found pet record
        const result = await this.foundPetRepository
            .createQueryBuilder()
            .insert()
            .into(FoundPet)
            .values({
                species: dto.species,
                breed: dto.breed,
                color: dto.color,
                size: dto.size,
                description: dto.description,
                photo_url: dto.photo_url,
                finder_name: dto.finder_name,
                finder_email: dto.finder_email,
                finder_phone: dto.finder_phone,
                address: dto.address,
                found_date: new Date(dto.found_date),
                location: () =>
                    `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
            })
            .returning('*')
            .execute();

        const foundPet = result.generatedMaps[0] as FoundPet;

        
        const nearbyLostPets = await this.lostPetsService.findNearby(
            dto.longitude,
            dto.latitude,
            500,
        );

        this.logger.log(
            `Se encontraron ${nearbyLostPets.length} mascota(s) perdida(s) en un radio de 500m`,
        );

        
        for (const lostPet of nearbyLostPets) {
            try {
                await this.mailService.sendMatchNotification(lostPet, foundPet);
                this.logger.log(
                    `Correo enviado a ${lostPet.owner_email} por mascota "${lostPet.name}"`,
                );
            } catch (error) {
                this.logger.error(
                    `Error enviando correo a ${lostPet.owner_email}: ${error.message}`,
                );
            }
        }

        return {
            foundPet,
            matchesFound: nearbyLostPets.length,
        };
    }

    async findAll(): Promise<FoundPet[]> {
        return this.foundPetRepository.find({
            order: { found_date: 'DESC' },
        });
    }
}
