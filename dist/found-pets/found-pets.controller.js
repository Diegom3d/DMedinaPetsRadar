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
exports.FoundPetsController = void 0;
const common_1 = require("@nestjs/common");
const found_pets_service_1 = require("./found-pets.service");
const create_found_pet_dto_1 = require("./dto/create-found-pet.dto");
let FoundPetsController = class FoundPetsController {
    foundPetsService;
    constructor(foundPetsService) {
        this.foundPetsService = foundPetsService;
    }
    async create(createFoundPetDto) {
        const result = await this.foundPetsService.create(createFoundPetDto);
        return {
            message: 'Mascota encontrada registrada exitosamente',
            data: result.foundPet,
            matchesFound: result.matchesFound,
            notification: result.matchesFound > 0
                ? `Se notificó a ${result.matchesFound} dueño(s) de mascota(s) perdida(s) cercana(s)`
                : 'No se encontraron mascotas perdidas en un radio de 500 metros',
        };
    }
};
exports.FoundPetsController = FoundPetsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_found_pet_dto_1.CreateFoundPetDto]),
    __metadata("design:returntype", Promise)
], FoundPetsController.prototype, "create", null);
exports.FoundPetsController = FoundPetsController = __decorate([
    (0, common_1.Controller)('found-pets'),
    __metadata("design:paramtypes", [found_pets_service_1.FoundPetsService])
], FoundPetsController);
//# sourceMappingURL=found-pets.controller.js.map