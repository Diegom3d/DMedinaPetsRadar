import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private readonly lostPetRepository: Repository<LostPet>,
    ) { }

    async create(dto: CreateLostPetDto): Promise<LostPet> {
        const lostPet = this.lostPetRepository.create({
            name: dto.name,
            species: dto.species,
            breed: dto.breed,
            color: dto.color,
            size: dto.size,
            description: dto.description,
            photo_url: dto.photo_url,
            owner_name: dto.owner_name,
            owner_email: dto.owner_email,
            owner_phone: dto.owner_phone,
            address: dto.address,
            lost_date: new Date(dto.lost_date),
            is_active: true,
            location: () =>
                `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
        } as any);

        // Use query builder to insert with raw SQL for the geometry column
        const result = await this.lostPetRepository
            .createQueryBuilder()
            .insert()
            .into(LostPet)
            .values({
                name: dto.name,
                species: dto.species,
                breed: dto.breed,
                color: dto.color,
                size: dto.size,
                description: dto.description,
                photo_url: dto.photo_url,
                owner_name: dto.owner_name,
                owner_email: dto.owner_email,
                owner_phone: dto.owner_phone,
                address: dto.address,
                lost_date: new Date(dto.lost_date),
                is_active: true,
                location: () =>
                    `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
            })
            .returning('*')
            .execute();

        return result.generatedMaps[0] as LostPet;
    }

    async findNearby(
        longitude: number,
        latitude: number,
        radiusMeters: number,
    ): Promise<(LostPet & { distance: number })[]> {
        const results = await this.lostPetRepository
            .createQueryBuilder('lp')
            .addSelect(
                `ST_Distance(lp.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography)`,
                'distance',
            )
            .where('lp.is_active = :active', { active: true })
            .andWhere(
                `ST_DWithin(lp.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radius)`,
            )
            .setParameters({
                lng: longitude,
                lat: latitude,
                radius: radiusMeters,
            })
            .orderBy('distance', 'ASC')
            .getRawAndEntities();

        return results.entities.map((entity, index) => ({
            ...entity,
            distance: parseFloat(results.raw[index].distance),
        }));
    }
}
