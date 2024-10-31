const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("location", async (data) => {
    if (!data.latitude || !data.longitude) {
      return;
    }
    try {
      var latitude = parseFloat(data.latitude);
      var longitude = parseFloat(data.longitude);
      const url = `https://roads.googleapis.com/v1/nearestRoads?points=${data.latitude},${data.longitude}&key=${process.env.GOOGLE_API_KEY}`;
      const response = await axios.get(url);
      if (response.data != {}) {
        latitude = response.data?.snappedPoints?.[0]?.location.latitude;
        longitude = response.data?.snappedPoints?.[0]?.location.longitude;
      }
      io.emit("location", {
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Erro ao obter dados da API do Google Roads:", error);
      socket.emit("locationError", {
        message: "Erro ao obter dados da localização",
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
