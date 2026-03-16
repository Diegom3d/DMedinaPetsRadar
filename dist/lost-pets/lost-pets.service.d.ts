import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
export declare class LostPetsService {
    private readonly lostPetRepository;
    constructor(lostPetRepository: Repository<LostPet>);
    create(dto: CreateLostPetDto): Promise<LostPet>;
    findNearby(longitude: number, latitude: number, radiusMeters: number): Promise<(LostPet & {
        distance: number;
    })[]>;
}
