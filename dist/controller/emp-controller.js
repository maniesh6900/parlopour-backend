"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpGetTasks = exports.EmpLogin = exports.Empsingup = void 0;
const prisma_1 = require("../prisma");
const ApiError_1 = require("../utils/ApiError");
const ApiResonse_1 = require("../utils/ApiResonse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.Empsingup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.AdminsingupSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(411, "data not found");
    }
    const salt = bcrypt_1.default.genSaltSync(12);
    const hashedPassword = bcrypt_1.default.hashSync(parsedData.data.password, salt);
    const emp = yield prisma_1.client.employee.create({
        data: {
            username: parsedData.data.username,
            password: hashedPassword,
        },
    });
    if (!emp) {
        throw new ApiError_1.ApiError(500, "server is having some problems");
    }
    const token = jsonwebtoken_1.default.sign({
        empId: emp.id,
    }, process.env.JWT_SECRET);
    res
        .cookie("token", token, { secure: true, httpOnly: true })
        .json(new ApiResonse_1.ApiResponse(200, { emp: emp, token }, "employee created successfully"));
}));
exports.EmpLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.AdminsingupSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(411, "data not found");
    }
    const emp = yield prisma_1.client.employee.findFirst({
        where: {
            username: parsedData.data.username,
        },
    });
    if (!emp) {
        throw new ApiError_1.ApiError(411, "admin with this name does not exist");
    }
    const isPasswordValid = bcrypt_1.default.compareSync(parsedData.data.password, emp.password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        empId: emp.id,
    }, process.env.JWT_SECRET);
    res
        .cookie("token", token, { secure: true, httpOnly: true })
        .json(new ApiResonse_1.ApiResponse(200, { emp: emp, token }, "login succefullt"));
}));
exports.EmpGetTasks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emp = yield prisma_1.client.employee.findFirst({
        where: {
            id: req.user,
        },
    });
    if (!emp) {
        throw new ApiError_1.ApiError(401, "please Login again");
    }
    const task = yield prisma_1.client.task.findMany({
        where: {
            assignto: emp.username,
        },
    });
    res
        .json(new ApiResonse_1.ApiResponse(200, { task }, "tasks fetched successfully"));
}));
