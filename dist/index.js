"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./.env",
});
const ws_1 = require("ws");
const app_1 = require("./app");
const user_1 = require("./ws/user");
app_1.app.listen(3000);
const wss = new ws_1.WebSocketServer({ port: 3001 });
wss.on('connection', (ws) => {
    const user = new user_1.User(ws);
    ws.on('error', console.error);
});
