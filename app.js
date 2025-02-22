const express = require("express");
const path = require("path");
const connectDb = require("./config/db");
const cors = require("cors");
const AuthRouter = require("./routes/AuthRoutes");

const ProviderRoutes = require("./routes/ServiceProviderRoute");
const customerRoutes = require("./routes/CustomerRoute");
const serviceRoutes = require("./routes/ServiceRoute");
const requestRoutes = require("./routes/RequestRoute");







const app = express();

connectDb();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static images from the "images" directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/api/auth", AuthRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/provider", ProviderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/requests", requestRoutes);


const port = 3000;

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});
