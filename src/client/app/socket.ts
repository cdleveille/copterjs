import { ISocket } from "../../shared/types/abstract";

// @ts-ignore
const socketIO: ISocket = io;
export default socketIO.connect({ reconnectionDelay: 1000, reconnectionAttempts: 10 });
