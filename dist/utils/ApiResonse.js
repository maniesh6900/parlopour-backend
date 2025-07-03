"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, data, message) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.success = true;
    }
}
exports.ApiResponse = ApiResponse;
