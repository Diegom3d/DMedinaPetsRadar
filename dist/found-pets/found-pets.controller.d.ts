import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
export declare class FoundPetsController {
    private readonly foundPetsService;
    constructor(foundPetsService: FoundPetsService);
    create(createFoundPetDto: CreateFoundPetDto): Promise<{
        message: string;
        data: import("./entities/found-pet.entity").FoundPet;
        matchesFound: number;
        notification: string;
    }>;
}
