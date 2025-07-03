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
exports.EditTask = exports.DeleteTask = exports.GetTask = exports.CreateTask = exports.AdminLogin = exports.Adminsingup = void 0;
const prisma_1 = require("../prisma");
const ApiError_1 = require("../utils/ApiError");
const ApiResonse_1 = require("../utils/ApiResonse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.Adminsingup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.AdminsingupSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(411, "data not found");
    }
    const salt = bcrypt_1.default.genSaltSync(12);
    const hashedPassword = bcrypt_1.default.hashSync(parsedData.data.password, salt);
    const admin = yield prisma_1.client.admin.create({
        data: {
            username: parsedData.data.username,
            password: hashedPassword,
        },
    });
    if (!admin) {
        throw new ApiError_1.ApiError(500, "server is having some problems");
    }
    const token = jsonwebtoken_1.default.sign({
        adminId: admin.id,
    }, process.env.JWT_SECRET);
    res
        .cookie("token", token, { secure: true, httpOnly: true })
        .json(new ApiResonse_1.ApiResponse(200, { admin: admin, token }, "admin created successfully"));
}));
exports.AdminLogin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.AdminsingupSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(411, "data not found");
    }
    const admin = yield prisma_1.client.admin.findFirst({
        where: {
            username: parsedData.data.username,
        },
    });
    if (!admin) {
        throw new ApiError_1.ApiError(411, "admin with this name does not exist");
    }
    const isPasswordValid = bcrypt_1.default.compareSync(parsedData.data.password, admin.password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        adminId: admin.id,
    }, process.env.JWT_SECRET);
    res
        .cookie("token", token, { secure: true, httpOnly: true })
        .json(new ApiResonse_1.ApiResponse(200, { admin: admin, token }, "login succefullt"));
}));
exports.CreateTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.CreateTaskSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(406, "data not found");
    }
    const user = yield prisma_1.client.employee.findFirst({
        where: {
            username: parsedData.data.assinedTo,
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(411, "user with this username not found");
    }
    const task = yield prisma_1.client.task.create({
        data: {
            title: parsedData.data.title,
            description: parsedData.data.description,
            assignto: parsedData.data.assinedTo,
            adminId: req.user,
        },
    });
    if (!task) {
        throw new ApiError_1.ApiError(500, "server is having some problems");
    }
    res
        .json(new ApiResonse_1.ApiResponse(200, task, "new task created succefully"));
}));
exports.GetTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield prisma_1.client.task.findMany({
        where: {
            adminId: req.adminId,
        },
    });
    if (!tasks) {
        throw new ApiError_1.ApiError(500, "server is having some problems");
    }
    res
        .json(new ApiResonse_1.ApiResponse(200, tasks, " tasks fatched succefully"));
}));
exports.DeleteTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = req.body;
    if (!parsedData) {
        throw new ApiError_1.ApiError(411, "data not found");
    }
    const task = yield prisma_1.client.task.delete({
        where: {
            id: parsedData.id,
        },
    });
    res.json(new ApiResonse_1.ApiResponse(200, task, "task deleted successfully"));
}));
exports.EditTask = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parsedData = types_1.EditTaskSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new ApiError_1.ApiError(411, "data not found");
    }
    const task = yield prisma_1.client.task.update({
        where: {
            id: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.id,
        },
        data: {
            title: parsedData.data.title,
            description: parsedData.data.description,
            assignto: parsedData.data.assignto,
        },
    });
}));
