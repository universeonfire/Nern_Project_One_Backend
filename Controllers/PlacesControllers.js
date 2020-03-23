const mongoose = require("mongoose");
const { validationResult } = require('express-validator');

const Place = require('../Models/PlaceModel');
const User = require("../Models/UserModel");
const HttpError = require("../Models/HttpErrors");

const getPlaceById = async (req, res ,next) =>{
    const placeID = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeID);
    } catch (error) {
        const err = new HttpError("Cannot fetch place by id",500);
        return next(err);
    }
    
    if(!place){
        return next(new HttpError("Can not find places for this user id",404));
    }
    res.json({place: place.toObject({getters:true})});

};

const getPlacesByUserId = async (req,res,next) => {
    const userID = req.params.uid;
    let places;
    try {
        places = await Place.find({creator : userID});
    } catch (error) {
        const err = new HttpError("Cannot fetch places by user id",500);
        return next(err);
    }
    if(places.length === 0){
        return next(new HttpError("Can not find places for this user id " + userID,404));
    }
    res.json({places});
};

const createPlace = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const {title,description,location,address,creator,image} = req.body;
    const newPlace = new Place({
        title,
        description,
        location,
        address,
        creator,
        image
    });
    //user check
    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        return next(
            new HttpError('can not fetch the data', 500)
            );
    }
    if(!user){
        return next(
            new HttpError('can not find user !', 404)
            );
    }
    //transaction block to rollback if something go wrong!!!!
    try {
        const currentSession = await mongoose.startSession();
        currentSession.startTransaction();
        await newPlace.save({session:currentSession});
        user.places.push(newPlace);
        await user.save({session:currentSession});
        await currentSession.commitTransaction();
    } catch (error) {
        const err = new HttpError("Cannot created place, try again!",500);
        return next(err);
    }
    res.status(201).json({place: newPlace});  
};

const updatePlace = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const placeID = req.params.pid;
    const {title,description} = req.body;
    let place;
    try {
        place = await Place.findByIdAndUpdate(placeID);
    } catch (error) {
        const err = new HttpError("Cannot find place, try again!",500);
        return next(err);
    }
    
    place.title = title;
    place.description = description;
    try {
        await place.save();
    } catch (error) {
        const err = new HttpError("Cannot update place, try again!",500);
        return next(err);
    }

    res.status(200).json({place: place.toObject({getters: true})});
}

const deletePlace = async (req,res,next) => {
    const placeID = req.params.pid;
    //using poulate to delete item from user's places array 
    try {
        await Place.findByIdAndDelete({_id:placeID}).populate("creator");
    } catch (error) {
        const err = new HttpError("Cannot fetch place, try again!",500);
        return next(err);
    }
     
    res.status(200).json({message:"place deleted"});
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;