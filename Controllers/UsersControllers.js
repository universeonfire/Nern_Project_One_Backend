const { validationResult } = require('express-validator');

const User = require("../Models/UserModel");
const HttpError = require("../Models/HttpErrors");

const getAllUsers = async (req,res,next) => {
    let users;
    try {
        users = await User.find({},"-password");
    } catch (error) {
        const err = new HttpError("can not fetch users",500);
        return next(err);
    }
    if(users.length === 0){
        return next(new HttpError("can not find any user",404));
    }
    res.json({users});
}
const signup = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const {name,email,password} = req.body;
    const newUser = new User({
        name,
        email,
        password,
        places:[]
    });
    try {
        await newUser.save();
    } catch (error) {
        const err = new HttpError("can not create user",500);
        return next(error);
    }
   
    res.status(201).json({user: newUser});

}
const signin = async (req,res,next) => {
    const {email,password} = req.body;
    let validUser;
    try {
        validUser = await User.findOne({email: email});
    } catch (error) {
        const err = new HttpError("Failed to login",500);
        return next(err);
    }
     
    if(!validUser || validUser.password !== password){
        return next(new HttpError("wrong email or password!",401));
    }
    res.json({message:"Login Successful!"})

}

exports.getAllUsers = getAllUsers;
exports.signin = signin;
exports.signup = signup;