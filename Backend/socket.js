import { Server } from "socket.io";

let io;

const initSocket = (server) => {
    // Create a new socket server
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Listen for connections
    io.on("connection", (socket) => {
        console.log("Socket Connected : ", socket.id);

        // When a user joins a conversation
        socket.on("joinConversation", (conversationId) => {
            if(conversationId){
                socket.join(conversationId);
                console.log(`User ${socket.id} joined room: ${conversationId}`);
            }
        });

        // When a user sends a message
        socket.on("sendMessage", (savedMessage) => {
            if(!savedMessage || !savedMessage.conversationId){
                console.error("SendMessage Error: Data is null or missing conversationId");
                return;
            }

            io.to(savedMessage.conversationId.toString()).emit(
                "receiveMessage", 
                savedMessage
            );
        });

        // When a user disconnects
        socket.on("disconnect", () => {
            console.log("Socket Disconnected : ", socket.id);
        });
    })
}

export { initSocket, io };