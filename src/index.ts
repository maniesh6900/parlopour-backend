import dotenv from "dotenv";
dotenv.config({
    path : "./.env",
});

import { WebSocketServer } from 'ws';
import { app } from './app';
import { User } from './ws/user';
app.listen(3000);

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
    const user = new User(ws);
    ws.on('error', console.error);

});