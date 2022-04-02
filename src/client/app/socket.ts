import { ISocket } from "../../shared/types/abstract";

// @ts-ignore
// eslint-disable-next-line no-undef
export default io.connect({ reconnectionDelay: 1000, reconnectionAttempts: 10 }) as ISocket;
