const express = require("express");
const {check} = require("express-validator");

const PlacesControllers = require("../Controllers/PlacesControllers");

const router = express.Router();


//User Place List with User ID
router.get("/user/:uid", PlacesControllers.getPlacesByUserId); 
//Place with place ID
router.get("/:pid", PlacesControllers.getPlaceById);
//Create a new place
router.post("/",[
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],PlacesControllers.createPlace);
//Update a place
router.patch("/:pid",[
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ] ,PlacesControllers.updatePlace);
//Delete place
router.delete("/:pid", PlacesControllers.deletePlace);



module.exports = router;