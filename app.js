const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const AuthRouter = require("./routes/AuthRoutes");
const RequestRoutes = require("./routes/RequestRoute");
const ProviderRoutes = require("./routes/ServiceProviderRoute");
const customerRoutes = require("./routes/CustomerRoute");

 // Add this

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

app.use("/api/auth", AuthRouter);
app.use("/api/request", RequestRoutes);
app.use("/api/provider", ProviderRoutes);
app.use("/api/customers", customerRoutes); // Register provider routes

const port = 3000;

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});
