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
exports.LivestockBatch = void 0;
const typeorm_1 = require("typeorm");
const SaleRecord_1 = require("./SaleRecord");
let LivestockBatch = class LivestockBatch {
};
exports.LivestockBatch = LivestockBatch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], LivestockBatch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LivestockBatch.prototype, "batchCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LivestockBatch.prototype, "species", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], LivestockBatch.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleRecord_1.SaleRecord, (saleRecord) => saleRecord.livestockBatch),
    __metadata("design:type", Array)
], LivestockBatch.prototype, "saleRecords", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LivestockBatch.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LivestockBatch.prototype, "updatedAt", void 0);
exports.LivestockBatch = LivestockBatch = __decorate([
    (0, typeorm_1.Entity)("livestock_batches")
], LivestockBatch);
