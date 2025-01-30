
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize"); // for sql injection
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");



const express=require("express")
const connectDb=require("./config/db")
const UserRouter=require("./routes/UserRoute")
const ServiceProviderRoute=require("./routes/ServiceProviderRoute")


app.use(cors());
app.options("*", cors());

// Load env file
dotenv.config({
  path: "./config/config.env",
});


// Body parser
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));


// const GroundRouter=require("./routes/GroundRoute")
const app=express();

connectDb();





app.use(express.json());
//mount routers 
app.use("/api/User",UserRouter );
app.use("/api/ServiceProvider",ServiceProviderRoute);

//body parser
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
     app.use(morgan("dev"));
   }
// app.use("/",()=>{
//     console.log("you r here")
// })

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));


const port=3000;
app.listen(port,()=>{
     console.log(`Server running at http://localhost:${port}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
     console.log(`Error: ${err.message}`.red);
     // Close server & exit process
     server.close(() => process.exit(1));
   });
   