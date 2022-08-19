const mongoose =require("mongoose")



const CarritoSchema= new mongoose.Schema({
    id:{
        type: Number,
        required: [true, 'El id es obligatorio'],
    },
    timestamp:{
        type: Number,
        required: false,
    },   
     productos : { type : Array , "default" : [] }
})

CarritoSchema.methods.toJSON = function(){
    const {__v,_id,...data} = this.toObject();
   // data.id = _id;
    return data;
  }

module.exports=mongoose.model("carritos",CarritoSchema)