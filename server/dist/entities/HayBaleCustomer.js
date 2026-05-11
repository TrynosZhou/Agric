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
exports.HayBaleCustomer = void 0;
const typeorm_1 = require("typeorm");
const SaleRecord_1 = require("./SaleRecord");
const HayBaleSale_1 = require("./HayBaleSale");
let HayBaleCustomer = class HayBaleCustomer {
};
exports.HayBaleCustomer = HayBaleCustomer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], HayBaleCustomer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HayBaleCustomer.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HayBaleCustomer.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HayBaleCustomer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HayBaleSale_1.HayBaleSale, (sale) => sale.customer),
    __metadata("design:type", Array)
], HayBaleCustomer.prototype, "hayBaleSales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleRecord_1.SaleRecord, (saleRecord) => saleRecord.customer),
    __metadata("design:type", Array)
], HayBaleCustomer.prototype, "saleRecords", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HayBaleCustomer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HayBaleCustomer.prototype, "updatedAt", void 0);
exports.HayBaleCustomer = HayBaleCustomer = __decorate([
    (0, typeorm_1.Entity)("hay_bale_customers")
], HayBaleCustomer);
