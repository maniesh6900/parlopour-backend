"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (promiseHandler) => {
    return (req, res, next) => {
        Promise.resolve(promiseHandler(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
