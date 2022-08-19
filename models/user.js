const mongoose =require("mongoose") 

const collection = "Users"

const UserSchema = new mongoose.Schema({   
    username: String,  
    password: String,
    nombre: String,
    direccion: String,
    edad: String,
    telefono: String,
    foto: String,
    carritoId: Number,

})

module.exports = mongoose.model(collection, UserSchema)