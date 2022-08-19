const express = require("express")
const { Router } = express
const router = Router()
const passport = require('passport')
const { enviarMailAdministrador } = require("../utils/mail")
const users = require('../models/user')
const { createHash, isValidPassword } = require('../utils/utils')
const multer = require('multer');
const path = require('path')
const extname = require('path').extname
const { createLogger } = require('../utils/logger')
const logger = createLogger()

const user = require("../models/user")
const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/uploads'))
        },
        filename: function (req, file, cb) {

            cb(null, file.originalname)
        }
    }
)
const upload = multer({ storage: storage ,fileFilter: async function (req, file, cb) {
    const fileType = /jpeg|jpg|png/;
    const mimetype = fileType.test(file.mimetype);
    const name = fileType.test(extname(file.originalname));
    if (!mimetype || !name) {
      // el archivo no es imagen, NO GUARDAR     
       cb(null, false, new Error("No guardar la imagen"));
    }
    cb(null, true)
}})

router.get("/", (req, res) => {
    logger.info("req.session.usuario:" + req.session.usuario)
    if (req.session.usuario) {
        return res.sendFile("index.html", { root: "./public" })

    }
    return res.sendFile("login.html", { root: "./public" })

})
router.get("/register", (req, res) => {
    logger.info("/register get")
    return res.sendFile("register.html", { root: "./public" })

})

router.get("/login", (req, res) => {
    // res.sendFile('./public/login.html', { root: __dirname });
    res.sendFile('login.html', { root: "./public" });
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/failedLogin' }), (req, res) => {
    logger.info("/login")
    const { username } = req.body;
    if (username) {
        req.session.usuario = username;
        res.redirect('/');

    } else {
        res.redirect('/login');
    }
})

router.get('/failedLogin', (req, res) => {
    res.render("error", { accion: "LOGIN", regreso: "/login" })
})

router.post("/getUsername", (req, res) => {
    let resultado = "no registrado"
    if (req.session.usuario) {
        resultado = req.session.usuario
    }
    return res.json({ usuario: resultado })
})

router.get("/getUserData", async (req, res) => {
    let resultado = "no registrado"
   
    if (req.session.usuario) {

        let username = req.session.usuario
        let user = await users.findOne({ username })
      
        if (user) return res.json(user)
    }
    return res.json({ usuario: resultado })
})

//actualiza el id de carrito en el usuario
router.put("/userCarrito/:id/:userName", async (req, res) => {
    let id = req.params.id
    let username = req.params.userName
    let resultado = "no registrado"
    
    if (username) {
        let user = await users.findOne({ username })
        if (user) {
            let item = await users.updateOne({ username }, { carritoId: id })
            return res.json(item)
        }
    }
    return res.json({ usuario: resultado })
})


router.get("/logout", (req, res) => {
    console.log("logout")
    const username = req.session.usuario;

    req.session.destroy(err => {
        if (err) {
            return console.log(err);
            //res.json({ status: 'Logout ERROR', body: err })
        }

        res.cookie("usuario", username, { maxAge: parseInt(process.env.TIEMPO_SESSION) })
        res.sendFile('logout.html', { root: "./public" });
    })
})

// router.post('/register',
//     passport.authenticate('register', { failureRedirect: '/failedRegister' }),
//     upload.single('file'),
//     (req, res) => {
//         const file = req.file;
//         console.log('file')
//         console.log(file)
//         // res.send(file.originalname)
//         enviarMailAdministrador('nuevoRegistro', 'Nuevo registro', req.body)
//         res.redirect('/login');
//     })

router.post('/register', upload.single('file'),
async (req, res) => {
        const file = req.file;
        let foto = file.originalname

        const username = req.body.username;
        const userExists = await user.findOne({ username });
        if (!userExists) {
            const newUser = {
                username,
                password: createHash(req.body.password),
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                telefono: req.body.telefonoCompleto,
                foto: foto,
                carritoId: 0
            }
            try {
                let result = await users.create(newUser)
                enviarMailAdministrador('nuevoRegistro', 'Nuevo registro', req.body)
                res.redirect('/login');
            } catch (err) {
                logger.error(err)
                res.redirect('/failedRegister');            
            }
        }      
    })

router.get('/failedRegister', (req, res) => {
    res.render("error", { accion: "REGISTER", regreso: "/register" })
})

module.exports = router;