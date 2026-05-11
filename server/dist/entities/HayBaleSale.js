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
exports.HayBaleSale = exports.paymentStatuses = void 0;
const typeorm_1 = require("typeorm");
const HayBaleCustomer_1 = require("./HayBaleCustomer");
exports.paymentStatuses = ["paid", "pending"];
let HayBaleSale = class HayBaleSale {
};
exports.HayBaleSale = HayBaleSale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], HayBaleSale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HayBaleCustomer_1.HayBaleCustomer, (customer) => customer.hayBaleSales, { onDelete: "SET NULL" }),
    __metadata("design:type", HayBaleCustomer_1.HayBaleCustomer)
], HayBaleSale.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], HayBaleSale.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 12, scale: 2 }),
    __metadata("design:type", String)
], HayBaleSale.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], HayBaleSale.prototype, "saleDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "pending" }),
    __metadata("design:type", String)
], HayBaleSale.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HayBaleSale.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HayBaleSale.prototype, "updatedAt", void 0);
exports.HayBaleSale = HayBaleSale = __decorate([
    (0, typeorm_1.Entity)("hay_bale_sales")
], HayBaleSale);
