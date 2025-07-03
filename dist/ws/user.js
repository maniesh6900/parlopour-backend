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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const index_1 = require("../prisma/index");
class User {
    constructor(ws) {
        this.ws = ws;
        this.inithandler();
    }
    inithandler() {
        this.ws.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const msg = JSON.parse(data.toString());
            switch (msg.type) {
                case "punch":
                    const id = (_a = msg === null || msg === void 0 ? void 0 : msg.payload) === null || _a === void 0 ? void 0 : _a.id;
                    const type = (_b = msg === null || msg === void 0 ? void 0 : msg.payload) === null || _b === void 0 ? void 0 : _b.type;
                    const user = yield index_1.client.employee.update({
                        where: {
                            id,
                        },
                        data: {
                            punch: type,
                        },
                    });
                    this.ws.send(`user name : ${user.username} has Punch-${type}`);
                    break;
            }
        }));
    }
}
exports.User = User;
