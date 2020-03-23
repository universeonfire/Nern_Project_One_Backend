const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./Routes/PlacesRoutes");
const usersRoutes = require("./Routes/UsersRoutes");
const HttpError = require("./Models/HttpErrors");
const DbCredentials = require("./DatabaseCredentials/DbCredentials");

const app = express();
const db_url = DbCredentials.createUrl();

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


mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose
    .connect(db_url)
    .then(()=>{
        app.listen(5000);
    })
    .catch(error => {
        console.log("Error has occured while connecting db")
    });
