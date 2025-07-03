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
exports.AdminMiddleware = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.AdminMiddleware = (0, asyncHandler_1.asyncHandler)((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const header = req.headers["authorization"] ?? "";
    // const token = header?.split(" ")[1];
    const { token } = req.cookies;
    if (!token) {
        throw new ApiError_1.ApiError(411, "Unauthorized");
    }
    const decorded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decorded) {
        throw new ApiError_1.ApiError(400, "token has failed please login again and retry");
    }
    // @ts-ignore
    if (decorded.adminId) {
        // @ts-ignore
        req.user = decorded.adminId;
        next();
    }
    else {
        throw new ApiError_1.ApiError(400, "You are not logged in");
    }
}));
