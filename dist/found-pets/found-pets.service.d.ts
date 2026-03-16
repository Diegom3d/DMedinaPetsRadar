import { Repository } from 'typeorm';
import { FoundPet } from './entities/found-pet.entity';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { LostPetsService } from '../lost-pets/lost-pets.service';
import { MailService } from '../mail/mail.service';
export declare class FoundPetsService {
    private readonly foundPetRepository;
    private readonly lostPetsService;
    private readonly mailService;
    private readonly logger;
    constructor(foundPetRepository: Repository<FoundPet>, lostPetsService: LostPetsService, mailService: MailService);
    create(dto: CreateFoundPetDto): Promise<{
        foundPet: FoundPet;
        matchesFound: number;
    }>;
}
