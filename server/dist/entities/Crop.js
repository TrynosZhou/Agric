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
exports.Crop = exports.cropTypes = void 0;
const typeorm_1 = require("typeorm");
const Field_1 = require("./Field");
const SaleRecord_1 = require("./SaleRecord");
const DetasselingTask_1 = require("./DetasselingTask");
const TomatoHarvestCycle_1 = require("./TomatoHarvestCycle");
exports.cropTypes = ["barley", "seed maize", "tomatoes", "custom"];
let Crop = class Crop {
};
exports.Crop = Crop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Crop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 30 }),
    __metadata("design:type", String)
], Crop.prototype, "cropType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Crop.prototype, "plantingDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Crop.prototype, "customCropType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Crop.prototype, "fieldName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "planned" }),
    __metadata("design:type", String)
], Crop.prototype, "growthStage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Crop.prototype, "irrigationSchedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", String)
], Crop.prototype, "estimatedYield", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], Crop.prototype, "fertilizerApplications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], Crop.prototype, "pesticideApplications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Field_1.Field, (field) => field.crops, { onDelete: "SET NULL" }),
    __metadata("design:type", Field_1.Field)
], Crop.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleRecord_1.SaleRecord, (saleRecord) => saleRecord.crop),
    __metadata("design:type", Array)
], Crop.prototype, "saleRecords", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DetasselingTask_1.DetasselingTask, (task) => task.crop),
    __metadata("design:type", Array)
], Crop.prototype, "detasselingTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TomatoHarvestCycle_1.TomatoHarvestCycle, (cycle) => cycle.crop),
    __metadata("design:type", Array)
], Crop.prototype, "harvestCycles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Crop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Crop.prototype, "updatedAt", void 0);
exports.Crop = Crop = __decorate([
    (0, typeorm_1.Entity)("crops")
], Crop);
