"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundPetsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const found_pet_entity_1 = require("./entities/found-pet.entity");
const found_pets_service_1 = require("./found-pets.service");
const found_pets_controller_1 = require("./found-pets.controller");
const lost_pets_module_1 = require("../lost-pets/lost-pets.module");
let FoundPetsModule = class FoundPetsModule {
};
exports.FoundPetsModule = FoundPetsModule;
exports.FoundPetsModule = FoundPetsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([found_pet_entity_1.FoundPet]), lost_pets_module_1.LostPetsModule],
        controllers: [found_pets_controller_1.FoundPetsController],
        providers: [found_pets_service_1.FoundPetsService],
    })
], FoundPetsModule);
//# sourceMappingURL=found-pets.module.js.map