const mongoose = require("mongoose")
const mongoURI = "mongodb://localhost:27017"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI  , ()=>{
        console.log("connect susccefully to mongoose");
    })
}
module.exports = connectToMongo;