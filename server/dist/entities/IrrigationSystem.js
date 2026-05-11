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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IrrigationSystem = exports.irrigationStatuses = exports.powerSources = exports.irrigationTypes = void 0;
const typeorm_1 = require("typeorm");
const Field_1 = require("./Field");
exports.irrigationTypes = ["center pivot", "pump"];
exports.powerSources = ["diesel", "electric", "solar"];
exports.irrigationStatuses = ["active", "faulty", "inactive"];
let IrrigationSystem = class IrrigationSystem {
};
exports.IrrigationSystem = IrrigationSystem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], IrrigationSystem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], IrrigationSystem.prototype, "systemType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], IrrigationSystem.prototype, "coverageAreaOrCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], IrrigationSystem.prototype, "powerSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "inactive" }),
    __metadata("design:type", String)
], IrrigationSystem.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], IrrigationSystem.prototype, "waterUsageLog", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], IrrigationSystem.prototype, "fuelUsageLog", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], IrrigationSystem.prototype, "scheduledMaintenanceDates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Field_1.Field, (field) => field.irrigationSystems, { onDelete: "SET NULL" }),
    __metadata("design:type", Field_1.Field)
], IrrigationSystem.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], IrrigationSystem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], IrrigationSystem.prototype, "updatedAt", void 0);
exports.IrrigationSystem = IrrigationSystem = __decorate([
    (0, typeorm_1.Entity)("irrigation_systems")
], IrrigationSystem);
