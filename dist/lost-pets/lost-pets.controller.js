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
exports.LostPetsController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const lost_pets_service_1 = require("./lost-pets.service");
const create_lost_pet_dto_1 = require("./dto/create-lost-pet.dto");
let LostPetsController = class LostPetsController {
    lostPetsService;
    constructor(lostPetsService) {
        this.lostPetsService = lostPetsService;
    }
    async create(createLostPetDto) {
        const lostPet = await this.lostPetsService.create(createLostPetDto);
        return {
            message: 'Mascota perdida registrada exitosamente',
            data: lostPet,
        };
    }
    async findAll() {
        const pets = await this.lostPetsService.findAll();
        return {
            message: 'Listado de mascotas perdidas activas recuperado exitosamente',
            data: pets,
        };
    }
};
exports.LostPetsController = LostPetsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lost_pet_dto_1.CreateLostPetDto]),
    __metadata("design:returntype", Promise)
], LostPetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    (0, cache_manager_1.CacheKey)('lost-pets-list'),
    (0, cache_manager_1.CacheTTL)(60000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LostPetsController.prototype, "findAll", null);
exports.LostPetsController = LostPetsController = __decorate([
    (0, common_1.Controller)('lost-pets'),
    __metadata("design:paramtypes", [lost_pets_service_1.LostPetsService])
], LostPetsController);
//# sourceMappingURL=lost-pets.controller.js.map