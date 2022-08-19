const mongoose = require("mongoose")


const ProductoSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: [true, 'El id es obligatorio'],
    },
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    descripcion:{
        type: String,
        required: false,
    },
    codigo:{
        type: String,
        required: false,
    },
    foto:{
        type: String,
        required: false,
    },
    precio:{
        type: Number,
        required: [true, 'El precio es obligatorio'],
    },
    stock:{
        type: Number,
        required: [true, 'El stock es obligatorio'],
    },
    timestamp:{
      type: Number,
      required: true,
  }
});

module.exports = mongoose.model('productos',ProductoSchema);

