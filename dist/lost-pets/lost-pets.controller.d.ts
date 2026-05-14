import { LostPetsService } from './lost-pets.service';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
export declare class LostPetsController {
    private readonly lostPetsService;
    constructor(lostPetsService: LostPetsService);
    create(createLostPetDto: CreateLostPetDto): Promise<{
        message: string;
        data: import("./entities/lost-pet.entity").LostPet;
    }>;
    findAll(): Promise<{
        message: string;
        data: import("./entities/lost-pet.entity").LostPet[];
    }>;
}
