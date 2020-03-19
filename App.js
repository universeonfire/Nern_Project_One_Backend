const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./Routes/PlacesRoutes");
const usersRoutes = require("./Routes/UsersRoutes");
const HttpError = require("./Models/HttpErrors");

const app = express();
app.use(bodyParser.json());

app.use("/api/places",placesRoutes);

app.use("/api/users",usersRoutes);

app.use((req,res,next)=>{
    const error = new HttpError("Can not find this route",404);
    throw error;
});

//error handling middleware
app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || "Something went wrong :("});
    
});

app.listen(5000);