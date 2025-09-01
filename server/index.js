const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server)

const axios = require("axios");

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
};

io.on("connection", (socket) => {
    console.log(`User is connected : ${socket.id}`)
    socket.on("join", ({ roomId, username }) => {
        userSocketMap[socket.id] = username
        socket.join(roomId)
        const clients = getAllConnectedClients(roomId)
        console.log(clients)
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username, // name of new user
                socketId: socket.id, // id of new user
            });
        });
    })

    // sync the code
    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code });
    });
    // when new user join the room all the code which are there are also shows on that persons editor
    socket.on("sync-code", ({ socketId, code }) => {
        io.to(socketId).emit("code-change", { code });
    });

    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        // leave all the room
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    });

    socket.on("execute-code", async ({ roomId, code, language = "javascript" }) => {
        try {
            // Call Piston API
            console.log("heelo from server")
            const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language,
                version: "*",
                files: [
                    {
                        content: code,
                    },
                ]
            });
            const { run } = response.data;
            const outputText = run.output || run.stdout || run.stderr || "";

            // Send the output back to the room
            io.to(roomId).emit("code-output", {
                result: outputText,
                error: run.stderr,
            });
        } catch (err) {
            io.to(roomId).emit("code-output", { error: err.message });
        }
    });

})

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log("Server is running"))