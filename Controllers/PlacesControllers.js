const { validationResult } = require('express-validator');

const HttpError = require("../Models/HttpErrors");


let DUMMY_PLACES = [
    {
        id:"p1",
        title:"p1 title",
        description:"p1 description",
        location:{
            lat:0,
            lng:0
        },
        address:"p1 address",
        creator:"u1"
    },
    {
        id:"p2",
        title:"p2 title",
        description:"p2 description",
        location:{
            lat:0,
            lng:0
        },
        address:"p2 address",
        creator:"u1"
    },
    {
        id:"p3",
        title:"p3 title",
        description:"p3 description",
        location:{
            lat:0,
            lng:0
        },
        address:"p3 address",
        creator:"u2"
    }
]

const getPlaceById = (req, res ,next) =>{
    const placeID = req.params.pid;
    const place = DUMMY_PLACES.find(place => place.id === placeID);
    if(!place){
        return next(new HttpError("Can not find places for this user id",404));
    }
    res.json({place});

};

const getPlacesByUserId = (req,res,next) => {
    const userID = req.params.uid;
    const places = DUMMY_PLACES.filter(place => place.creator === userID);
    if(places.length === 0){
        return next(new HttpError("Can not find place for this place id",404));
    }
    res.json({places});
};

const createPlace = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const {id,title,description,location,address,creator} = req.body;
    const newPlace = {
        id, 
        title,
        description,
        location,
        address,
        creator
    }
    DUMMY_PLACES.push(newPlace);
    res.status(201).json({place: newPlace});  
};

const updatePlace = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    const placeID = req.params.pid;
    const {title,description} = req.body;
    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeID) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeID);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
}

const deletePlace = (req,res,next) => {
    const placeID = req.params.pid;
    DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeID);

    res.status(200).json({message:"place deleted"});
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;