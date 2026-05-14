"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FoundPetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundPetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const found_pet_entity_1 = require("./entities/found-pet.entity");
const lost_pets_service_1 = require("../lost-pets/lost-pets.service");
const mail_service_1 = require("../mail/mail.service");
let FoundPetsService = FoundPetsService_1 = class FoundPetsService {
    foundPetRepository;
    lostPetsService;
    mailService;
    logger = new common_1.Logger(FoundPetsService_1.name);
    constructor(foundPetRepository, lostPetsService, mailService) {
        this.foundPetRepository = foundPetRepository;
        this.lostPetsService = lostPetsService;
        this.mailService = mailService;
    }
    async create(dto) {
        const result = await this.foundPetRepository
            .createQueryBuilder()
            .insert()
            .into(found_pet_entity_1.FoundPet)
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
            location: () => `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
        })
            .returning('*')
            .execute();
        const foundPet = result.generatedMaps[0];
        const nearbyLostPets = await this.lostPetsService.findNearby(dto.longitude, dto.latitude, 500);
        this.logger.log(`Se encontraron ${nearbyLostPets.length} mascota(s) perdida(s) en un radio de 500m`);
        for (const lostPet of nearbyLostPets) {
            try {
                await this.mailService.sendMatchNotification(lostPet, foundPet);
                this.logger.log(`Correo enviado a ${lostPet.owner_email} por mascota "${lostPet.name}"`);
            }
            catch (error) {
                this.logger.error(`Error enviando correo a ${lostPet.owner_email}: ${error.message}`);
            }
        }
        return {
            foundPet,
            matchesFound: nearbyLostPets.length,
        };
    }
    async findAll() {
        return this.foundPetRepository.find({
            order: { found_date: 'DESC' },
        });
    }
};
exports.FoundPetsService = FoundPetsService;
exports.FoundPetsService = FoundPetsService = FoundPetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(found_pet_entity_1.FoundPet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        lost_pets_service_1.LostPetsService,
        mail_service_1.MailService])
], FoundPetsService);
//# sourceMappingURL=found-pets.service.js.map