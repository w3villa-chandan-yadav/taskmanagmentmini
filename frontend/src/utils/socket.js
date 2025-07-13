import { io } from "socket.io-client";

const socket = io("https://taskmanagmentmini.onrender.com"
//     , {
//   autoConnect: false,
//   withCredentials: true,
// }
);

export default socket;
