const express = require("express")
const { Router } = express
const router = Router()
const users = require('../models/user')
const { carritoSelected } = require('../daos/index')
const { enviarMailAdministrador } = require("../utils/mail")
const { enviarSmsUsuario } = require("../utils/sms")



const data = new carritoSelected()
//const data =  Carrito


router.get('/:id/productos', async (req, res) => {
    let id = req.params.id
    let carritoBuscado = await data.getDataById(id)
 
    if (carritoBuscado) {  
        res.status(200).json(carritoBuscado.productos)
    } else {
        res.status(400).json({ error: 'carrito no encontrado' })
    }
})


router.post('/', async (req, res) => {
    let carrito = await data.create({ id: 0, timestamp: Date.now(), productos: [] })

    if (carrito != null) {
        res.status(201).json({id:carrito.id})
    }
});

router.post('/:id/productos', async (req, res) => {
    let id = req.params.id
    let mensaje = req.body
  
    await data.updateProductos(id, mensaje)

    res.status(200).json(id)
})

router.delete('/:id', async (req, res) => {
  
    let id = req.params.id
    let idBorrado = await data.deleteCarrito(id)

    if (idBorrado != null) {
        res.status(200).json({ id: idBorrado })
    } else {
        res.status(400).json({ error: 'carrito no encontrado' })
    }
});

router.delete('/:id/productos/:id_prod', async (req, res) => {
    let id = req.params.id
    let id_prod = req.params.id_prod
    let idBorrado = await data.deleteProducto(id, id_prod)

    if (idBorrado != null) {
        res.status(200).json({ id: idBorrado })
    } else {
        res.status(400).json({ error: 'carrito o producto no encontrado' })
    }
});


// const finishOrder = async (req, res) => {
//     try {
//         const idCart = req.params.idCart;
//         const idUser = req.params.idUser;
//         const user = await usuario.getById(idUser);
//         const productos = await cart.getProductsCart(idCart);

//         const smsMsg = `Gracias ${user.nombre}, hemos recibido su pedido y se encuentra en proceso de preparación. Próximamente recibirá novedades en su email.`
//         const subject = `Nuevo pedido de ${user.nombre} (${user.email})`

//         //Envío de SMS
//         await sendMessage(user.telefono, smsMsg)
//         //Envío de Whatsapp
//         await sendMessage(user.telefono, subject, true)
//         //Envío de mail
//         await enviarMailAdministrador('nuevoPedido', subject, {user,productos});

//         res.status(200).json({mensaje: `Se ha finalizado el carrito ${idCart} del usuario: ${idUser}`});        
//     } catch (error) {
//         req.app.get('logger').error(error);
//         res.status(400).json({error});        
//     }
// }

router.get("/finalizar/:id", async (req, res) => {
    let carritoId = req.params.id
    let carritoBuscado = await data.getDataById(carritoId)
    let user = await users.findOne({ carritoId })
    const subject = `Nuevo pedido de ${user.nombre} (${user.username})`

    await enviarMailAdministrador('nuevoPedido', subject, { user, productos: carritoBuscado.productos });
    await enviarSmsUsuario("Su pedido se ha recibido y se encuentra en proceso", user.telefono)
    res.status(200).json({ mensaje: `Se ha finalizado el carrito ${carritoId} del usuario: ${user.username}` });

})

module.exports = router;

