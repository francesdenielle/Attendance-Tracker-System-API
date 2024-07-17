const express = require('express');
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const app = express();

require('dotenv').config();

var corsOptions = {
  origin: "https://attendance-tracker-system.onrender.com",
}; 

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the attendance tracker back end." });
});

app.use('/api', require('./routes/userRoutes'));

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT,
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});