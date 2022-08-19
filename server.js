const passport = require('passport')
const { initializePassport } = require('./passport.config')
const handlebars = require("express-handlebars")
const express = require("express")
const session = require("express-session")

const app = express()
const PORT = process.env.PORT || 8080
const MODO = process.env.MODO || "FORK"
//Variable administrador definida temporamente
global.ADMINISTRADOR = true;

const productosRouter = require("./routes/productosRoutes")
const carritoRouter = require("./routes/carritoRoutes")
const defaultRouter = require("./routes/default")
const path = require("path")

const { createLogger } = require('./utils/logger')
const logger = createLogger()

const mongoose = require('mongoose')
const connection = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: "coder",
    rolling: true,
    resave: true,
    saveUninitialized: false,
    key: 'usuario_sid',
    cookie: {
        maxAge: parseInt(process.env.TIEMPO_SESSION),
        httpOnly: false,
        secure: false
    }
}
))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine("hbs",
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: "index.hbs"
    }
    ))

app.set("view engine", "hbs")
app.set("views", "./views")

app.use("/api/productos", productosRouter)
app.use("/api/carrito", carritoRouter)
app.use("/", defaultRouter)

app.use(function (req, res, next) {
    res.status(404);
   let message=`ruta ${req.originalUrl} metodo ${req.method} no implementado`
    res.json({ error: -2, descripcion: message });
   
    logger.info(message);
    next();
});

const inicioServer = () => {   
    const server = app.listen(PORT, () => {
        logger.info(`Conectado http escuchando en ${server.address().port} en modo ${MODO}` );
        //logger.info(`escuchando en puerto  ${server.address().port}`)
    })
    server.on("error", err => logger.error(err))
}



if (MODO !== 'FORK') {

    if (cluster.isPrimary) {
        logger.info(`Proceso principal ID:(${process.pid})`)
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            //nuevo servidor en caso de fin
            cluster.fork();
        });

    } else {
        logger.info(`Proceso worker ID:(${process.pid})`)
        inicioServer();
    }
} else {

    inicioServer();
}