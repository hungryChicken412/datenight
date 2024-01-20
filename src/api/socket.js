import { Server } from "socket.io";
import http from "http";

const httpServer = http.createServer();
const io = new Server(httpServer, {
	path: "/api/socket",
});

io.on("connection", (socket) => {
	// handle socket events here
});

httpServer.listen(3000, () => {
	console.log("Server is running on port 3000");
});
