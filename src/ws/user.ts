import { WebSocket } from "ws";
import {client} from "../prisma/index";

export class User {
    ws : WebSocket;
    constructor(ws : WebSocket){
        this.ws = ws;
        this.inithandler();
    }
    inithandler() {
        this.ws.on("message", async(data)=> {
            const msg = JSON.parse(data.toString());
            switch(msg.type) {
                case "punch" : 
                    const id = msg?.payload?.id;
                    const type = msg?.payload?.type;
                    const user = await client.employee.update({
                        where : {
                            id,
                        },
                        data : {
                            punch : type,
                        },
                    });
                    this.ws.send(`user name : ${user.username} has Punch-${type}`);
                    break;
            }
        });

    }
}