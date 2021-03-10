import { Server as http} from "http";
import { Socket, Server } from "socket.io";

export default class Connection {

    private io : Server
    private port : number

    constructor(port: number, http : http, options: any){
        this.port = port
        this.io = new Server(http, options)
        this.io.on("connection", this.connectionHandler)
    }

    private connectionHandler(socket: Socket){
        this.io.emit("hello", "world");
        console.log(socket.id, 'joined')
    }

    private receive(){

    }
    private send(){

    }
}