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
exports.SaleRecord = void 0;
const typeorm_1 = require("typeorm");
const Crop_1 = require("./Crop");
const LivestockBatch_1 = require("./LivestockBatch");
const HayBaleCustomer_1 = require("./HayBaleCustomer");
const FinanceEntry_1 = require("./FinanceEntry");
let SaleRecord = class SaleRecord {
};
exports.SaleRecord = SaleRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], SaleRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], SaleRecord.prototype, "saleDate", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 12, scale: 2 }),
    __metadata("design:type", String)
], SaleRecord.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleRecord.prototype, "itemDescription", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Crop_1.Crop, (crop) => crop.saleRecords, { onDelete: "SET NULL" }),
    __metadata("design:type", Crop_1.Crop)
], SaleRecord.prototype, "crop", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => LivestockBatch_1.LivestockBatch, (batch) => batch.saleRecords, { onDelete: "SET NULL" }),
    __metadata("design:type", LivestockBatch_1.LivestockBatch)
], SaleRecord.prototype, "livestockBatch", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HayBaleCustomer_1.HayBaleCustomer, (customer) => customer.saleRecords, { onDelete: "SET NULL" }),
    __metadata("design:type", HayBaleCustomer_1.HayBaleCustomer)
], SaleRecord.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FinanceEntry_1.FinanceEntry, (financeEntry) => financeEntry.saleRecord),
    __metadata("design:type", Array)
], SaleRecord.prototype, "financeEntries", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SaleRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SaleRecord.prototype, "updatedAt", void 0);
exports.SaleRecord = SaleRecord = __decorate([
    (0, typeorm_1.Entity)("sale_records")
], SaleRecord);
