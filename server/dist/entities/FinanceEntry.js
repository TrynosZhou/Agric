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
exports.FinanceEntry = exports.financeCategories = void 0;
const typeorm_1 = require("typeorm");
const SaleRecord_1 = require("./SaleRecord");
const Crop_1 = require("./Crop");
exports.financeCategories = [
    "seeds",
    "fertilizer",
    "labour",
    "fuel",
    "feed",
    "livestock sale",
    "crop sale",
    "hay bale sale",
    "maintenance"
];
let FinanceEntry = class FinanceEntry {
};
exports.FinanceEntry = FinanceEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], FinanceEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FinanceEntry.prototype, "entryType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 40 }),
    __metadata("design:type", String)
], FinanceEntry.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 12, scale: 2 }),
    __metadata("design:type", String)
], FinanceEntry.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], FinanceEntry.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], FinanceEntry.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SaleRecord_1.SaleRecord, (saleRecord) => saleRecord.financeEntries, { onDelete: "SET NULL" }),
    __metadata("design:type", SaleRecord_1.SaleRecord)
], FinanceEntry.prototype, "saleRecord", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Crop_1.Crop, { onDelete: "SET NULL", nullable: true }),
    __metadata("design:type", Crop_1.Crop)
], FinanceEntry.prototype, "crop", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FinanceEntry.prototype, "livestockGroup", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FinanceEntry.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FinanceEntry.prototype, "updatedAt", void 0);
exports.FinanceEntry = FinanceEntry = __decorate([
    (0, typeorm_1.Entity)("finance_entries")
], FinanceEntry);
