import { Server } from "socket.io";
import { Message } from "../models/messages.model.js  ";

export const initializeSocket = (server) => {
  const io = new Server(server,{
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);

      userActivities.set(userId, "Idle");
      console.log("User Sockets", userSockets);
      console.log("User Sockets", userActivities);
      // broadcast to all connnected sockets that this user is just logged In
      io.emit("user_connected", userId);

      socket.emit("users_online", Array.from(userSockets.keys()));

      io.emit("activities", Array.from(userActivities.keys()));
    });
    socket.on("update_activity", ({ userId, activity }) => {
      console.log("activity updated ", userId, activity);
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });
        const receiverSocketId = userSockets.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
      } catch (error) {
        console.log("Message_error", error);
        socket.emit("message_error", error.message);
      }
    });

    socket.on("disconnect", () => {
      let disconnectUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId == userId) {
          disconnectUserId = true;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectUserId) {
        io.emit("user_disconnected", disconnectUserId);
      }
    });
  });
};
