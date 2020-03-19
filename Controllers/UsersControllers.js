const { validationResult } = require('express-validator');

const HttpError = require("../Models/HttpErrors");

let DUMMY_USERS = [
    {
        id:"u1",
        name:"u1 Name",
        email:"u1@email.com",
        password:"asdasdasd"
    },
    {
        id:"u2",
        name:"u2 Name",
        email:"u2@email.com",
        password:"asdasdasd"
    }

]

const getAllUsers = (req,res,next) => {
    res.json({users:DUMMY_USERS});
}
const signup = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    const {id,name,email,password} = req.body;
    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('Could not create user, email already exists.', 422);
    }
    const newUser = {
        id,
        name,
        email,
        password
    }
    DUMMY_USERS.push(newUser);
    res.status(201).json({newUser});

}
const signin = (req,res,next) => {
    const {email,password} = req.body;
    const validUser = DUMMY_USERS.find(user=>user.email === email);
    if(!validUser || validUser.password !== password){
        return next(new HttpError("wrong email or password!",401));
    }
    res.json({message:"Login Successful!"})

}

exports.getAllUsers = getAllUsers;
exports.signin = signin;
exports.signup = signup;