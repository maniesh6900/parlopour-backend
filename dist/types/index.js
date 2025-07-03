"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTaskSchema = exports.CreateTaskSchema = exports.AdminsingupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.AdminsingupSchema = zod_1.default.object({
    username: zod_1.default.string().min(3),
    password: zod_1.default.string(),
});
exports.CreateTaskSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    assinedTo: zod_1.default.string(),
});
exports.EditTaskSchema = zod_1.default.object({
    id: zod_1.default.string(),
    assignto: zod_1.default.string(),
    title: zod_1.default.string(),
    description: zod_1.default.string(),
});
