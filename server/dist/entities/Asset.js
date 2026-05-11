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
exports.Asset = exports.assetConditions = exports.assetCategories = void 0;
const typeorm_1 = require("typeorm");
const Field_1 = require("./Field");
exports.assetCategories = ["machinery", "tool", "vehicle", "irrigation"];
exports.assetConditions = ["good", "fair", "damaged"];
let Asset = class Asset {
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Asset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], Asset.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { default: 0 }),
    __metadata("design:type", Number)
], Asset.prototype, "quantityAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { default: 0 }),
    __metadata("design:type", Number)
], Asset.prototype, "quantityInUse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "good" }),
    __metadata("design:type", String)
], Asset.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "currentAssignedUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], Asset.prototype, "maintenanceLogEntries", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Field_1.Field, (field) => field.assets, { onDelete: "SET NULL" }),
    __metadata("design:type", Field_1.Field)
], Asset.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Asset.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Asset.prototype, "updatedAt", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)("assets")
], Asset);
