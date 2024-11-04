const app = require("../app/app.js");
const mongoose = require("mongoose");

// Static configuration
const PORT = 1999;
const DATABASE =
  "mongodb+srv://secureauth:admin@cluster0.ehjwf.mongodb.net/GScore"; // Replace <PASSWORD> with actual password

// Connect to MongoDB
if (DATABASE) {
  mongoose
    .connect(DATABASE)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.error("MongoDB connection string is not defined.");
}

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
