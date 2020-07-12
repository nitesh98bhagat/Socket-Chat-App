const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//ADDING STATIC HTML,CSS & JS FILE FROM PUBLIC
app.use(express.static(path.join(__dirname, "public")));

//SOCKET SECTION
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    //join room with the room name passed
    socket.join(room);

    //WELCOME MESSAGE TO THE CLIENT WHO JOINS THE ROOM
    socket.emit(
      "message",
      formatMessage("ChatCord", `WELCOME ${username} to ${room}`)
    );

    //Sending messages in the selective room
    socket.on("chatMSG", (data) => {
      io.to(room).emit("message", formatMessage(data.username, data.msg));
    });

    //Broadcasting the joining message to the specific room
    socket
      .to(room)
      .broadcast.emit(
        "message",
        formatMessage("ChatCord", `${username} join the ${room} room`)
      );

    //ON DISSCONNECTING a user from a group
    socket.on("disconnect", () => {
      //BROADCAST TO ALL CONNECTED USERS
      socket
        .to(room)
        .emit(
          "message",
          formatMessage("ChatCord", `A ${username} has left the ${room} chat`)
        );
    });
  });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server started on Port:${PORT}`));
