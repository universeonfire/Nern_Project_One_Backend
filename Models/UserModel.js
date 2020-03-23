const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
// has many places [] 

const UserSchema = new Schema({
    name:{type:String, required: true},
    password:{type:String, required: true , minlength: 8},
    email:{type:String, required:true, unique: true},
    image:{type:String},
    places:[{type:mongoose.Types.ObjectId, required: true, ref: "Place"}]
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User",UserSchema);