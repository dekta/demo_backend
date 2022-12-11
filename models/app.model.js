const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
    name:String,
    lastName:String,
    mobile:Number,
    city:String,
    state:String,
    address:String,
    userID : String

})

const AppModel = mongoose.model("app",appSchema);

module.exports={
    AppModel
}