const dotenv = require("dotenv")
dotenv.config()

const CarritosDaoFirebase = require("./carritos/carritoDaoFirebase")
const CarritosDaoMongoDB = require("./carritos/carritoDaoMongo")
const ProductosDaoFirebase = require('./productos/productoDaoFirebase')
const ProductosDaoMongoDB = require("./productos/productoDaoMongo")

let productoSelected
let carritoSelected

if (process.env.ENGINE == 'MONGODB') {  
    productoSelected = ProductosDaoMongoDB
    carritoSelected = CarritosDaoMongoDB
}

if (process.env.ENGINE == 'FIREBASE') {    
    productoSelected = ProductosDaoFirebase
    carritoSelected = CarritosDaoFirebase
}

module.exports ={
    productoSelected  ,
    carritoSelected 
}