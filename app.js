const express=require("express")
const connectDb=require("./config/db")
const UserRouter=require("./routes/UserRoute")
const ServiceProviderRoute=require("./routes/ServiceProviderRoute")
// const GroundRouter=require("./routes/GroundRoute")
const app=express();

connectDb();


app.use(express.json());

app.use("/api/User",UserRouter );
app.use("/api/ServiceProvider",ServiceProviderRoute);


// app.use("/",()=>{
//     console.log("you r here")
// })

const port=3000;
app.listen(port,()=>{
     console.log(`Server running at http://localhost:${port}`)
})