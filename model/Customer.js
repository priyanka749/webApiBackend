const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    image:{
        type:String,
        required:false
        },
});

const Customer = mongoose.model("customers", customerSchema);
module.exports = Customer;
