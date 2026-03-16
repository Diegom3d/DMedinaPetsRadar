import { ConfigService } from '@nestjs/config';
import { LostPet } from '../lost-pets/entities/lost-pet.entity';
import { FoundPet } from '../found-pets/entities/found-pet.entity';
export declare class MailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendMatchNotification(lostPet: LostPet, foundPet: FoundPet): Promise<void>;
    private extractCoordinates;
    private buildMapUrl;
}
