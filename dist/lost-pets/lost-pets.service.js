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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostPetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lost_pet_entity_1 = require("./entities/lost-pet.entity");
let LostPetsService = class LostPetsService {
    lostPetRepository;
    constructor(lostPetRepository) {
        this.lostPetRepository = lostPetRepository;
    }
    async create(dto) {
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
            location: () => `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
        });
        const result = await this.lostPetRepository
            .createQueryBuilder()
            .insert()
            .into(lost_pet_entity_1.LostPet)
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
            location: () => `ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`,
        })
            .returning('*')
            .execute();
        return result.generatedMaps[0];
    }
    async findAll() {
        return this.lostPetRepository.find({
            where: { is_active: true },
            order: { lost_date: 'DESC' },
        });
    }
    async findNearby(longitude, latitude, radiusMeters) {
        const results = await this.lostPetRepository
            .createQueryBuilder('lp')
            .addSelect(`ST_Distance(lp.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography)`, 'distance')
            .where('lp.is_active = :active', { active: true })
            .andWhere(`ST_DWithin(lp.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radius)`)
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
};
exports.LostPetsService = LostPetsService;
exports.LostPetsService = LostPetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lost_pet_entity_1.LostPet)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LostPetsService);
//# sourceMappingURL=lost-pets.service.js.map